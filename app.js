if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError=require("./utils/ExpressError.js");
const session = require('express-session');
const MongoStore = require('connect-mongo').default;
const flash = require('connect-flash');
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");
const listingRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");


//const MONGO_URL='mongodb://127.0.0.1:27017/homify';
const dbUrl=process.env.MONGO_URL;

async function main() {
    await mongoose.connect(dbUrl);
}

main().then(()=>{
    console.log("mongodb are connected");
}).catch(err=>{
    console.log(err);
});

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET
    },
    touchAfter: 24 * 3600 // time period in seconds
});

store.on("error",function(e){
    console.log("SESSION STORE ERROR",e);
});

const sessionOptions = {
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:false,
    cookie:{
        expires:Date.now()+1000*60*60*24*7,
        maxAge:1000*60*60*24*7,
        httpOnly:true,
    }
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error"); 
    res.locals.currUser=req.user;
    next();
});

// app.get("/demo",async(req,res)=>{
//     let fakeUser=new User({
//         email:"sambit@gmail.com",
//         username:"sambit"
//     });
//     let newUser=await User.register(fakeUser,"hello123");
//     res.send(newUser);
// }); 

app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);




app.all(/.*/,(req,res,next)=>{
    next(new ExpressError(404, "Page Not Found!"));
}); 

app.use((err,req,res,next)=>{
    let {statusCode=500,message="Something Went Wrong"}=err;
    res.status(statusCode).render("error.ejs",{err});
});

app.listen(8080,()=>{
    console.log("Server is running on port 8080");
}); 