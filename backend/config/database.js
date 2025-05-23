module.exports = ({ env }) => ({
  connection: {
    client: 'mysql',
    connection: {
      host: '127.0.0.1', // Hardcode to force IPv4
      port: env.int('DATABASE_PORT', 3306),
      database: env('DATABASE_NAME', 'vortilon_db'),
      user: env('DATABASE_USERNAME', 'vortilon_user'),
      password: env('DATABASE_PASSWORD', 'VortilonPass2025!'),
      ssl: env.bool('DATABASE_SSL', false),
    },
    pool: { min: env.int('DATABASE_POOL_MIN', 2), max: env.int('DATABASE_POOL_MAX', 10) },
  },
});
