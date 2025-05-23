'use strict';

const { createWorker, createScheduler } = require('tesseract.js');
const fs = require('fs');
const path = require('path');
const { fromPath } = require('pdf2pic');
const { execSync } = require('child_process');

module.exports = {
  async processPDF(ctx) {
    console.log('=== OCR PROCESS STARTED ===');
    try {
      const { id } = ctx.params;
      console.log(`Processing PDF with document_id: ${id}`);
      
      // Find the published PDF entry with title
      const pdfEntry = await strapi.db.query('api::pdf.pdf').findOne({
        where: {
          document_id: id,
          $or: [
            { publishedAt: { $ne: null } },
            { published_at: { $ne: null } }
          ]
        },
        populate: { pdf_file: true }, // Ensure the relation is populated
        select: ['id', 'title', 'document_id'],
      });

      console.log('PDF Entry:', JSON.stringify(pdfEntry, null, 2));

      if (!pdfEntry) {
        console.log(`No PDF entry found with document_id: ${id}`);
        return ctx.badRequest('PDF entry not found');
      }

      if (!pdfEntry.pdf_file) {
        console.log(`PDF entry found but file data is missing for document_id: ${id}`);
        return ctx.badRequest('PDF file data not found in entry');
      }

      // Access the file directly (no need to parse if it's a relation)
      const fileData = pdfEntry.pdf_file;
      console.log('File Data:', JSON.stringify(fileData, null, 2));

      if (!fileData.id) {
        console.log(`File data does not contain an ID for document_id: ${id}`);
        return ctx.badRequest('Invalid file data structure');
      }

      // Fetch the file entry using the CORRECT model name: plugin::upload.file
      const fileEntry = await strapi.db.query('plugin::upload.file').findOne({
        where: { id: fileData.id },
        select: ['url', 'hash', 'name'],
      });

      console.log('File Entry:', JSON.stringify(fileEntry, null, 2));

      if (!fileEntry || !fileEntry.url) {
        console.log(`File entry not found or missing URL for file ID: ${fileData.id}`);
        return ctx.badRequest('File entry not found in files table');
      }

      // Construct the full path using the URL
      const relativePath = fileEntry.url; // e.g., /uploads/invoice_79e43b0785.pdf
      const pdfPath = path.join('/root/vortilon-app/backend/public', relativePath);
      console.log('PDF Path:', pdfPath);

      // Verify file exists before proceeding
      if (!fs.existsSync(pdfPath)) {
        console.error(`File does not exist at path: ${pdfPath}`);
        return ctx.badRequest('PDF file not found on disk', { path: pdfPath });
      }
      console.log(`File exists at path: ${pdfPath}`);

      // Create a unique output name and directory
      const timestamp = Date.now();
      const outputDir = '/root/vortilon-app/backend/public/uploads';
      const outputBaseName = `ocr_${timestamp}`;
      
      console.log(`Output images will be saved to: ${outputDir}/${outputBaseName}`);
      
      // Use pdftoppm to convert all pages of the PDF to PNG
      try {
        console.log('Converting PDF to images using pdftoppm...');
        // Convert all pages of PDF to PNG
        execSync(`pdftoppm -png "${pdfPath}" "${path.join(outputDir, outputBaseName)}"`);
        console.log('PDF conversion completed');
      } catch (conversionError) {
        console.error('PDF conversion error:', conversionError);
        
        // Fallback to pdf2pic if pdftoppm fails
        console.log('Falling back to pdf2pic...');
        try {
          const options = {
            density: 150,
            format: 'png',
            width: 800,
            height: 800,
            outputDir: outputDir,
            outputName: outputBaseName,
            saveFilename: outputBaseName
          };
          
          const convert = fromPath(pdfPath, options);
          const result = await convert.bulk(-1); // Process all pages
          console.log('pdf2pic conversion result:', result);
        } catch (pdf2picError) {
          console.error('pdf2pic conversion error:', pdf2picError);
          return ctx.badRequest('Failed to convert PDF to image', { 
            pdftoppm_error: conversionError.message,
            pdf2pic_error: pdf2picError.message 
          });
        }
      }
      
      // Collect all converted images
      const files = fs.readdirSync(outputDir);
      const imageFiles = files
        .filter(file => file.startsWith(outputBaseName) && file.endsWith('.png'))
        .map(file => path.join(outputDir, file))
        .sort(); // Sort to process pages in order
      
      if (imageFiles.length === 0) {
        console.log('No converted images found');
        return ctx.badRequest('Could not find converted image files');
      }

      console.log(`Found ${imageFiles.length} pages to process`);

      // Perform OCR on all pages and concatenate the text
      console.log('Initializing Tesseract worker for v6.0.1...');
      const scheduler = createScheduler();
      const worker = await createWorker('eng');
      scheduler.addWorker(worker);

      let fullText = '';
      for (const imagePath of imageFiles) {
        console.log(`Processing page: ${imagePath}`);
        const result = await scheduler.addJob('recognize', imagePath);
        const text = result.data.text;
        fullText += text + '\n\n'; // Add separator between pages
        console.log(`Extracted text length for page: ${text.length}`);
      }

      // Terminate the worker and scheduler
      await scheduler.terminate();
      console.log('Tesseract worker and scheduler terminated');

      // Clean up temporary image files
      for (const imagePath of imageFiles) {
        try {
          fs.unlinkSync(imagePath);
          console.log(`Temporary image deleted: ${imagePath}`);
        } catch (cleanupError) {
          console.warn(`Warning: Failed to delete temporary image: ${imagePath}`, cleanupError);
        }
      }

      console.log('OCR completed successfully. Total text length:', fullText.length);
      console.log('First 100 chars of extracted text:', fullText.substring(0, 100));

      // Update the PDF entry with extracted text and title
      await strapi.entityService.update('api::pdf.pdf', pdfEntry.id, {
        data: {
          extracted_text: fullText,
          title: pdfEntry.title || 'Default Title', // Ensure title is included
        },
      });
      console.log(`Updated PDF entry ${pdfEntry.id} with extracted text`);

      console.log('=== OCR PROCESS COMPLETED SUCCESSFULLY ===');
      return ctx.send({ 
        message: 'OCR processed successfully', 
        text_length: fullText.length,
        text_preview: fullText.substring(0, 100),
        document_id: id,
        pdf_id: pdfEntry.id
      });
    } catch (error) {
      console.error('=== OCR PROCESS FAILED ===');
      console.error('Unhandled OCR Error:', error);
      return ctx.badRequest('Error processing PDF', { 
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  },
};
