

module.exports = {
  production: {
    dialect: 'postgres',
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    logging: console.log,
    seederStorage: 'sequelize',
  },
  development: {
    username: 'postgres',
    dialect: 'postgres',
    password: '',
    database: 'db_q_through_next_gen_smart_queue',
    host: process.env.DB_HOST || 'localhost',
    logging: console.log,
    seederStorage: 'sequelize',
  },
    dev_stage: {
      dialect: 'postgres',
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      logging: console.log,
      seederStorage: 'sequelize',
    }
};
