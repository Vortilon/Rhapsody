module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/pdfs/:id/process',
      handler: 'pdf.processPDF',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
