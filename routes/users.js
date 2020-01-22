var express = require('express');
var router = express.Router();
const db = require('../config/database');
const User = require('../model/User');

//Get All users
router.get('/', (req,res) =>
  User.findAll()
    .then(users => {
      console.log(users);
      //res.sendStatus(200);
      res.send(users);
    })
  .catch(err => console.log(err)));

  //Get Specific User
  router.get('/:id', (req,res) =>
    User.findByPk(req.params.id)
      .then(user => {
        console.log(user);
        //res.sendStatus(200);
        res.json(user);
      })
    .catch(err => console.log(err)));

  // POST single User
  router.post('/', (req, res) => {
    User
    .findOne({
      where: {
        'email': req.body.email
      }
    })
    .then((user, err) => {

      if(err){
        console.log(err);
      }

      if (user) {
        return res.status(401).send({
          message: 'Authentication failed. Email is already in use.',
        });
      } else {
        var newUser = new User();
        const id = req.body.id;
        const firstName = req.body.firstName;
        const lastName = req.body.lastName;
        const email = req.body.email;
        const address = req.body.address;
        const city = req.body.city;
        const zip = req.body.zip;
        const state = req.body.state;
        const password = newUser.generateHash(req.body.password);
        const userName = req.body.userName;
        const userType = req.body.userType;
        const createdAt = req.body.createdAt;
        const updatedAt = req.body.updatedAt;
        
        User.create({
          id: id,
          firstName: firstName,
          lastName: lastName,
          email: email,
          address: address,
          city: city,
          zip: zip,
          state: state,
          password: password,
          userName: userName,
          userType: userType,
          createdAt: createdAt,
          updatedAt: updatedAt
        })
          .then(newUser => {
            console.log(newUser);
            res.json(newUser);
        }).catch(err => console.log(err));
        }
      }); 
  });


module.exports = router;
