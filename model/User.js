const Sequelize = require('sequelize');
const db = require('../config/database');
const bcrypt   = require('bcrypt-nodejs');

const User = db.define('user', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  firstName: {
    type: Sequelize.STRING
  },
  lastName: {
    type: Sequelize.STRING
  },
  email: {
    type: Sequelize.STRING
  },
  address: {
    type: Sequelize.STRING
  },
  city: {
    type: Sequelize.STRING
  },
  zip: {
    type: Sequelize.INTEGER
  },
  state: {
    type: Sequelize.STRING
  },
  password: {
    type: Sequelize.STRING
  },
  userName: {
    type: Sequelize.STRING
  },
  userType: {
    type: Sequelize.STRING
  },
  createdAt: {
    type: Sequelize.DATE
  },
  updatedAt: {
    type: Sequelize.DATE
  }
})

// methods ======================
// generating a hash
User.prototype.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// // checking if password is valid
User.prototype.validPassword = function(password) {
  return bcrypt.compareSync(password, this.local.password);
};

User.prototype.comparePassword = function (passw, cb) {
  bcrypt.compare(passw, this.password, function (err, isMatch) {
      if (err) {
          return cb(err);
      }
      cb(null, isMatch);
  });
};
module.exports = User;
