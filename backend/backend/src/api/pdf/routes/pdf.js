'use strict';

module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/pdfs/:document_id/process',
      handler: 'pdf.processPDF',
      config: {
        policies: [],
        auth: false, // Disable authentication for testing
        middlewares: [],
        description: 'Process a PDF with OCR to extract text',
      },
    },
  ],
};
