const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: "mysql",
});

sequelize
  .authenticate()
  .then(() => console.log("connected db_network"))
  .catch((err) => console.log(`нет конекта к бд ${err}`));

sequelize.sync({ force: false }).then(() => {
  console.log(`Database & tables synchronised!`);
});

module.exports = sequelize;
