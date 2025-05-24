'use strict';

/**
 * PDF routes with public access configuration
 */

module.exports = {
  routes: [
    // Public route for processing PDFs
    {
      method: 'POST',
      path: '/api/pdfs/:id/process',
      handler: 'pdf.processPDF',
      config: {
        policies: [],
        middlewares: [],
        auth: false,
        description: 'Process a PDF with OCR to extract text',
      },
    },
    // Public route for analyzing PDFs
    {
      method: 'POST',
      path: '/api/pdfs/:id/analyze',
      handler: 'pdf.analyzePDF',
      config: {
        policies: [],
        middlewares: [],
        auth: false,
        description: 'Analyze a processed PDF document using AI for contract understanding',
      },
    },
  ],
};
