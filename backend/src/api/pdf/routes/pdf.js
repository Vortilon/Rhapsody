'use strict';

module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/pdfs/:id/process',
      handler: 'pdf.processPDF',
      config: {
        policies: [],
        auth: false, // Disable authentication for testing
        middlewares: [],
        description: 'Process a PDF with OCR to extract text',
      },
    },
    {
      method: 'POST',
      path: '/pdfs/:id/analyze',
      handler: 'pdf.analyzePDF',
      config: {
        policies: [],
        auth: false, // Disable authentication for testing
        middlewares: [],
        description: 'Analyze a processed PDF document using AI for contract understanding',
      },
    },
  ],
};
