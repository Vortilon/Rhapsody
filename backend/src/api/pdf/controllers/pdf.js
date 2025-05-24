'use strict';

/**
 * PDF controller for Strapi
 * Handles PDF processing and text extraction
 */

const fs = require('fs');
const path = require('path');
const { createWorker } = require('tesseract.js');

module.exports = {
  /**
   * Process a PDF document to extract text
   * @param {Object} ctx - Strapi context
   */
  async processPDF(ctx) {
    try {
      // Get the PDF ID from the URL parameter
      const { id } = ctx.params;
      console.log(`Processing PDF with ID: ${id}`);
      
      // Find the PDF entry by ID
      const pdfEntry = await strapi.entityService.findOne('api::pdf.pdf', id, {
        populate: ['pdf_file']
      });
      
      if (!pdfEntry) {
        console.log(`No PDF entry found with ID: ${id}`);
        return ctx.notFound('PDF entry not found');
      }
      
      console.log('PDF Entry found:', pdfEntry.title);
      
      // Check if PDF file is attached
      if (!pdfEntry.pdf_file) {
        console.log('No PDF file attached to this entry');
        return ctx.badRequest('No PDF file attached to this entry');
      }
      
      // Get file path
      const fileUrl = pdfEntry.pdf_file.url;
      const filePath = path.join(strapi.dirs.public, fileUrl);
      
      console.log(`File path: ${filePath}`);
      
      // Check if file exists
      if (!fs.existsSync(filePath)) {
        console.log(`File does not exist at path: ${filePath}`);
        return ctx.badRequest('PDF file not found on disk');
      }
      
      // Create temp directory
      const tempDir = path.join(strapi.dirs.public, 'uploads', 'temp');
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }
      
      // Initialize Tesseract worker
      console.log('Initializing Tesseract worker...');
      const worker = await createWorker();
      await worker.loadLanguage('eng');
      await worker.initialize('eng');
      
      // Extract text from PDF
      console.log('Extracting text from PDF...');
      const { data } = await worker.recognize(filePath);
      const extractedText = data.text;
      
      // Clean up
      await worker.terminate();
      console.log('Text extraction completed');
      
      // Update the PDF entry
      await strapi.entityService.update('api::pdf.pdf', id, {
        data: {
          processed: true,
          page_count: 1, // Simplified for testing
          extracted_text: extractedText
        }
      });
      
      console.log('PDF entry updated with extracted text');
      
      return ctx.send({
        success: true,
        message: 'PDF processed successfully',
        data: {
          id: pdfEntry.id,
          title: pdfEntry.title,
          text_preview: extractedText.substring(0, 100)
        }
      });
    } catch (error) {
      console.error('Error processing PDF:', error);
      return ctx.badRequest(`Error processing PDF: ${error.message}`);
    }
  },
  
  /**
   * Analyze a processed PDF document
   * @param {Object} ctx - Strapi context
   */
  async analyzePDF(ctx) {
    try {
      // Get the PDF ID from the URL parameter
      const { id } = ctx.params;
      
      // Get the query from the request body
      const { query } = ctx.request.body || {};
      
      if (!query) {
        return ctx.badRequest('Query parameter is required');
      }
      
      console.log(`Analyzing PDF ${id} with query: ${query}`);
      
      // Find the PDF entry
      const pdfEntry = await strapi.entityService.findOne('api::pdf.pdf', id);
      
      if (!pdfEntry) {
        return ctx.notFound('PDF not found');
      }
      
      // Check if PDF has been processed
      if (!pdfEntry.processed || !pdfEntry.extracted_text) {
        return ctx.badRequest('PDF has not been processed yet. Please process it first.');
      }
      
      // Mock analysis response
      // In a production environment, you would integrate with an AI service
      const analysis = `Based on my analysis of the document "${pdfEntry.title}" regarding "${query}":
      
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
