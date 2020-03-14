// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;

// load up the user model
var User            = require('../model/user');

// expose this function to our app using module.exports
module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
        console.log('serialize');
        console.log(user.id);
        
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findByPk(id).then( function(user, err) {
            console.log(user)
            done(err, user);
        });
    });

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) {
        console.log('req.body');
        console.log(req.body);
        // asynchronous
        // User.findOne wont fire unless data is sent back
        process.nextTick(function() {
            console.log('process')
        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        
        User.findOne({ where: {email : email}}).then( function(user, err)  {
            // if there are any errors, return the error
            if (err) {
                return done(err);
            }
            // check to see if theres already a user with that email
            if (user) {
                return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
            } else {
                console.log('user doesn not exist')
                // if there is no user with that email
                var newUser = new User();
                const password = newUser.generateHash(req.body.password);
                // create the user
                User.create({
                    email : email, 
                    password : password
                }).then(function(newUser,err){
                    if (err) {
                        return done(err);
                    }

                    if (newUser){
                        return done(null, newUser);
                    }
                
                })
                
                
            }
        });    
        
        });
        

    }));

     // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) { // callback with email and password from our form
            console.log(req.body.email)
        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        User.findOne({where:{ email :  req.body.email } }).then(function(user,err) {
            // if there are any errors, return the error before anything else
            console.log('Local-login')
            if (err){
                return done(err);
            }
            // if no user is found, return the message
            if (!user){
                return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
            }
            // if the user is found but the password is wrong
            if (!user.validPassword(password)){
                return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata
            }
            // all is well, return successful user
            console.log('done')
            return done(null, user);
        });

    }));

};