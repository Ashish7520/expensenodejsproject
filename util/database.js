const Sequelize = require("sequelize");

const sequelize = new Sequelize("expense-tracker", "root", "Ashish@2000", {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize;
