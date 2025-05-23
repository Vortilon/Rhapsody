module.exports = ({ env }) => ({
  email: {
    config: {
      provider: 'nodemailer',
      providerOptions: {
        host: env('SMTP_HOST', 'smtp.gmail.com'),
        port: env.int('SMTP_PORT', 587),
        auth: {
          user: env('SMTP_USERNAME', 'klaus@vortilon.com'),
          pass: env('SMTP_PASSWORD', 'Notung135!'),
        },
      },
      settings: {
        defaultFrom: 'no-reply@vortilon.com',
        defaultReplyTo: 'no-reply@vortilon.com',
      },
    },
  },
  'users-permissions': {
    config: {
      sso: {
        enabled: true,
      },
      providers: {
        google: {
          enabled: true,
          clientID: env('GOOGLE_CLIENT_ID', '58385555772-84moc6p8g35f57pb84bgg468eft1jmmv.apps.googleusercontent.com'),
          clientSecret: env('GOOGLE_CLIENT_SECRET', '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'),
          callbackURL: 'http://vortilon.com:1337/api/connect/google/callback',
        },
      },
    },
  },
  upload: {
    config: {
      provider: 'local',
      providerOptions: {
        sizeLimit: 10000000, // 10MB limit
      },
    },
  },
});
