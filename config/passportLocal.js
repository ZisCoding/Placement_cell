const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy
const User = require('../models/user');

passport.use(new LocalStrategy({
    usernameField: 'email', // telling to look at email property of request for the username
    passwordField:'password',// telling to look at password property of request for the password
    
},
    async function(email,password,done){
        try {
            // finding user
            const user = await User.findOne({email:email});
            // if user found and password is correct so authenticate
            if(user && user.password===password ){
                return done(null,user);    
            } 
            return done(null, false);


        } catch (error) {
            console.log("Error in finding user passport \n",error);
            return done(error);
        }
    }
))

// setting the user id to the cookies 
passport.serializeUser((user , done)=>{
    done(null,user.id);
});

// retrieving user id we saved to cookies and find data related to it 
passport.deserializeUser(async(id,done)=>{
    
    try {
        const user = await User.findById(id);
        return done(null,user);
    } catch (error) {
        console.log("Error in finding user --> deserialize",error);
        return done(error);
    }
});


module.exports = passport

