
const LocalStrategy = require('passport-local').Strategy;
const User = require('../modals/user');
const config = require('../config/database');
const bcrypt = require('bcryptjs');

module.exports = function(passport){
    //Local Strategy
    
    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
      },function(email, password, done){
        //Match Email
        let query = {email:email};
        User.findOne(query, function(err, user){
            if(err) throw err;
            if(!user){
                return done(null, false, {message: 'No user Found'});
            }
            //Match Password
            bcrypt.compare(password, user.password, function(err, isMatch){
                if(err) throw err;
                if(isMatch){
                    return done(null, user);
                } else {
                    return done(null, false, {message: 'Wrong Password'});
                }
            });
        });
    }));

    passport.serializeUser(function(user, done) {
        done(null, user.id);
      });
      
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
        done(err, user);
        });
    });

}