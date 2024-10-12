const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(process.env.DB_NAME || 'db_network', process.env.DB_USER || 'sobol', process.env.DB_PASSWORD || 'gdeta235R', {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || '3306',
  dialect: "mysql",
});

sequelize
  .authenticate()
  .then(() => console.log("connected db_network"))
  .catch((err) => console.log(`нет конекта к бд ${err}`));

sequelize.sync({ force: true }).then(() => {
  console.log(`Database & tables synchronised!`);
});

module.exports = sequelize;
