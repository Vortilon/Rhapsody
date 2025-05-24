'use strict';

/**
 * PDF routes configuration for Strapi
 */

module.exports = {
  routes: [
    // Public route for processing PDFs
    {
      method: 'POST',
      path: '/pdfs/:id/process',
      handler: 'pdf.processPDF',
      config: {
        policies: [],
        middlewares: [],
        auth: false,
      },
    },
    // Public route for analyzing PDFs
    {
      method: 'POST',
      path: '/pdfs/:id/analyze',
      handler: 'pdf.analyzePDF',
      config: {
        policies: [],
        middlewares: [],
        auth: false,
      },
    },
  ],
};
