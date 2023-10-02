const express = require('express');
const routes = require("./routes/index.js");
const path = require("path");
const expressLayouts = require("express-ejs-layouts");
const db = require("./config/mongoose.js");
const passport = require("passport");
const passportLocal = require("./config/passportLocal.js");
const session = require("express-session");
const mongoStore = require('connect-mongo');
const MongoStore = require('connect-mongo');

// initializing express 
const app = express();

//body parser
app.use(express.urlencoded({extended:true}));

//setting up view engine
app.set('view engine','ejs')
app.set('views',path.join(__dirname,'views'))


app.use(expressLayouts)

//extracting style and script from sub pages and putting it into the correct place in the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

// setting up directory to serve static files
app.use("/assets", express.static(path.join(__dirname,'assets')))

//using session to store session data in cookiee
app.use(session({
    name:"placement_cell",
    secret: "placement",
    cookie:{
        maxAge:null
    },
    // this will store cookie in mongo in case server restarts 
    store: MongoStore.create({
        mongoUrl: "mongodb://127.0.0.1:27017/placement_cell"
    })
}));

//initializing passport 
app.use(passport.initialize());
app.use(passport.session());

// setting up route handling from root "/
app.use('/',routes);

// initializing the server
const port = 7002;
app.listen(port,(err)=>{
    if(err){
        console.log("error in starting server \n",err);
        return;
    }
    console.log(`Server is up and running at http://localhost:${port}`)
})