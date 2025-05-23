module.exports = ({ env }) => ({
  apiToken: {
    salt: env('ADMIN_API_TOKEN_SALT', 'D3IpzMmqiKCN2zrhdP500g=='),
  },
  transfer: {
    token: {
      salt: env('TRANSFER_TOKEN_SALT', 'aNewRandomSalt123=='),
    },
  },
  auth: {
    secret: env('JWT_SECRET', 'aRandomJwtSecret123=='),
    sso: {
      enabled: true,
    },
    providers: [
      {
        uid: 'google',
        displayName: 'Google',
        icon: 'https://cdn2.iconfinder.com/data/icons/social-icons-33/128/Google-512.png',
        enabled: true,
      },
    ],
  },
});
