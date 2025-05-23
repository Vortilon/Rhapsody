module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  url: 'http://167.88.36.83:1337',
  app: {
    keys: [
      'dbRmLYOS+3i4mUMv9CgXxEbHsZrUv3BsUD2BA25havc=',
      '7CrSUdHapdfQmG+sxy4V3Epb19MkmuwDjwu2t+KHNfU=',
      'YZBgxSlDu7NRVIsqzoanJix+JusLTtdUGXfFP83P7aw=',
      'feuuq7bjmbYOeIs5BZs+U5GvJlPJYdX1+lgd3P6LBOU='
    ]
  },
  admin: {
    auth: {
      secret: env('JWT_SECRET', 'aRandomJwtSecret123=='),
    },
  },
});
