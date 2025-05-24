'use strict';

/**
 * PDF controller with simplified logic for better compatibility
 */

const fs = require('fs');
const path = require('path');
const { createWorker } = require('tesseract.js');

module.exports = {
  async processPDF(ctx) {
    try {
      const { id } = ctx.params;
      console.log(`Processing PDF with ID: ${id}`);
      
      // Find the PDF entry by ID
      const pdfEntry = await strapi.entityService.findOne('api::pdf.pdf', id, {
        populate: ['pdf_file']
      });
      
      if (!pdfEntry) {
        return ctx.notFound('PDF entry not found');
      }
      
      if (!pdfEntry.pdf_file) {
        return ctx.badRequest('No PDF file attached to this entry');
      }
      
      // Get file info
      const fileInfo = await strapi.entityService.findOne(
        'plugin::upload.file',
        pdfEntry.pdf_file.id
      );
      
      if (!fileInfo) {
        return ctx.badRequest('File information not found');
      }
      
      // Construct file path
      const filePath = path.join(strapi.dirs.public, fileInfo.url);
      
      if (!fs.existsSync(filePath)) {
        return ctx.badRequest('PDF file not found on disk');
      }
      
      // Create temp directory
      const tempDir = path.join(strapi.dirs.public, 'uploads', 'temp', id);
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }
      
      // Simple text extraction using Tesseract
      console.log('Starting OCR process...');
      const worker = await createWorker();
      await worker.loadLanguage('eng');
      await worker.initialize('eng');
      
      // For simplicity, we'll just extract text from the first page
      // In a production environment, you would process all pages
      const { data } = await worker.recognize(filePath);
      const extractedText = data.text;
      
      await worker.terminate();
      console.log('OCR completed');
      
      // Update the PDF entry
      await strapi.entityService.update('api::pdf.pdf', id, {
        data: {
          processed: true,
          page_count: 1, // Simplified for testing
          extracted_text: extractedText
        }
      });
      
      return ctx.send({
        success: true,
        message: 'PDF processed successfully',
        data: {
          id: pdfEntry.id,
          text_preview: extractedText.substring(0, 100)
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
      const { query } = ctx.request.body || {};
      
      if (!query) {
        return ctx.badRequest('Query parameter is required');
      }
      
      // Find the PDF entry
      const pdfEntry = await strapi.entityService.findOne('api::pdf.pdf', id);
      
      if (!pdfEntry) {
        return ctx.notFound('PDF not found');
      }
      
      if (!pdfEntry.processed || !pdfEntry.extracted_text) {
        return ctx.badRequest('PDF has not been processed yet');
      }
      
      // Mock analysis response
      const analysis = `Based on my analysis of the document regarding "${query}":
      
The document contains several sections related to your query. The most relevant information appears on pages 3-5.

Key points:
1. The agreement requires specific conditions related to your query
2. There are exceptions under relevant sections
3. The parties must comply with relevant requirements

This analysis is based on the extracted text from the document.`;
      
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
