const Sequelize = require('sequelize');

module.exports  = new Sequelize('fixed', 'postgres', 'Hernandez14', {
  host: 'localhost',
  dialect: 'postgres',
  operatorsAliases: '1',

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
});
