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
          document_id: id
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

      // Get the file information using the correct model name
      const fileInfo = await strapi.query('plugin::upload.file').findOne({
        where: { id: pdfEntry.pdf_file.id }
      });

      console.log('File Info:', JSON.stringify(fileInfo, null, 2));

      if (!fileInfo) {
        console.log(`File information not found for id: ${pdfEntry.pdf_file.id}`);
        return ctx.badRequest('File information not found');
      }

      // Construct the file path
      const filePath = path.join(strapi.dirs.public, fileInfo.url);
      console.log(`Constructed file path: ${filePath}`);

      // Check if file exists
      if (!fs.existsSync(filePath)) {
        console.log(`File does not exist at path: ${filePath}`);
        return ctx.badRequest('PDF file not found on disk');
      }

      // Create temp directory for images
      const tempDir = path.join(strapi.dirs.public, 'uploads', 'temp', id);
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }

      console.log(`Created temp directory: ${tempDir}`);

      // Convert PDF to images using pdf2pic
      const options = {
        density: 300,
        saveFilename: `page`,
        savePath: tempDir,
        format: 'png',
        width: 2000,
        height: 2000
      };

      let pageCount = 0;
      let extractedText = '';

      try {
        console.log('Attempting to convert PDF to images using pdf2pic...');
        const convert = fromPath(filePath, options);
        
        // Get total page count
        pageCount = await convert.bulk(-1, { responseType: 'array' })
          .then(results => {
            console.log(`Converted ${results.length} pages to images`);
            return results.length;
          });
      } catch (pdfError) {
        console.error('Error converting PDF with pdf2pic:', pdfError);
        
        // Fallback to pdftoppm if available
        try {
          console.log('Attempting fallback conversion with pdftoppm...');
          execSync(`pdftoppm -png -r 300 "${filePath}" "${tempDir}/page"`);
          
          // Count the number of generated files
          const files = fs.readdirSync(tempDir).filter(file => file.endsWith('.png'));
          pageCount = files.length;
          console.log(`Converted ${pageCount} pages using pdftoppm`);
        } catch (fallbackError) {
          console.error('Fallback conversion failed:', fallbackError);
          return ctx.badRequest('Failed to convert PDF to images');
        }
      }

      if (pageCount === 0) {
        console.log('No pages were converted from the PDF');
        return ctx.badRequest('Failed to extract pages from PDF');
      }

      // Set up Tesseract scheduler
      console.log('Setting up Tesseract OCR...');
      const scheduler = createScheduler();
      const numWorkers = Math.min(4, Math.max(1, require('os').cpus().length - 1));
      
      // Create workers
      const workers = [];
      for (let i = 0; i < numWorkers; i++) {
        const worker = await createWorker();
        await worker.loadLanguage('eng');
        await worker.initialize('eng');
        scheduler.addWorker(worker);
        workers.push(worker);
      }

      console.log(`Created ${numWorkers} Tesseract workers`);

      // Process each page
      const pageData = [];
      for (let i = 1; i <= pageCount; i++) {
        const pageNum = i;
        const imagePath = path.join(tempDir, `page${pageNum > 1 ? '-' + (pageNum - 1) : ''}.png`);
        
        if (!fs.existsSync(imagePath)) {
          console.log(`Image not found for page ${pageNum}: ${imagePath}`);
          continue;
        }

        console.log(`Processing page ${pageNum}/${pageCount}: ${imagePath}`);
        
        try {
          const { data } = await scheduler.addJob('recognize', imagePath);
          extractedText += `\n\n--- PAGE ${pageNum} ---\n\n${data.text}`;
          
          pageData.push({
            page_number: pageNum,
            text: data.text,
            image_path: imagePath.replace(strapi.dirs.public, '')
          });
          
          console.log(`Completed OCR for page ${pageNum}`);
        } catch (ocrError) {
          console.error(`OCR error on page ${pageNum}:`, ocrError);
        }
      }

      // Terminate workers
      console.log('Terminating Tesseract workers...');
      for (const worker of workers) {
        await worker.terminate();
      }

      // Save the extracted text to a file
      const textFilePath = path.join(tempDir, 'extracted_text.txt');
      fs.writeFileSync(textFilePath, extractedText);
      console.log(`Saved extracted text to: ${textFilePath}`);

      // Update the PDF entry with the extracted data
      await strapi.db.query('api::pdf.pdf').update({
        where: { id: pdfEntry.id },
        data: {
          processed: true,
          page_count: pageCount,
          extracted_text: extractedText,
          pages: pageData,
          text_file_path: textFilePath.replace(strapi.dirs.public, '')
        }
      });

      console.log('Updated PDF entry with extracted data');

      return ctx.send({
        success: true,
        message: 'PDF processed successfully',
        data: {
          id: pdfEntry.id,
          document_id: id,
          page_count: pageCount,
          text_file_path: textFilePath.replace(strapi.dirs.public, '')
        }
      });
    } catch (error) {
      console.error('Error processing PDF:', error);
      return ctx.badRequest(`Error processing PDF: ${error.message}`);
    }
  },

  async analyzePDF(ctx) {
    try {
      const { id } = ctx.params;
      const { query } = ctx.request.body;

      if (!query) {
        return ctx.badRequest('Query is required for analysis');
      }

      // Find the PDF entry
      const pdfEntry = await strapi.db.query('api::pdf.pdf').findOne({
        where: { document_id: id },
        select: ['id', 'title', 'document_id', 'extracted_text', 'processed']
      });

      if (!pdfEntry) {
        return ctx.notFound('PDF not found');
      }

      if (!pdfEntry.processed || !pdfEntry.extracted_text) {
        return ctx.badRequest('PDF has not been processed yet. Please process it first.');
      }

      // In a real implementation, you would call an AI service here
      // For example, using OpenAI's API:
      /*
      const openai = require('openai');
      const client = new openai.OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });

      const response = await client.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are an AI assistant that analyzes legal documents and contracts."
          },
          {
            role: "user",
            content: `Analyze the following document and answer this question: ${query}\n\nDocument content:\n${pdfEntry.extracted_text}`
          }
        ],
        temperature: 0,
        max_tokens: 1000
      });

      const analysis = response.choices[0].message.content;
      */

      // For now, we'll return a mock response
      const analysis = `Based on my analysis of the document "${pdfEntry.title}" regarding "${query}":

The document contains several sections related to your query. The most relevant information appears on pages 3-5, where the contract specifies the terms and conditions you're asking about.

Key points:
1. The agreement requires [specific condition related to query]
2. There are exceptions under [relevant section]
3. The parties must comply with [relevant requirements]

This analysis is based on the extracted text from the document. For a more detailed understanding, please consult with a legal professional.`;

      return ctx.send({
        success: true,
        document_id: id,
        query,
        result: analysis
      });
    } catch (error) {
      console.error('Error analyzing PDF:', error);
      return ctx.badRequest(`Error analyzing PDF: ${error.message}`);
    }
  }
};
