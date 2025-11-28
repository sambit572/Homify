const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing=require("./models/listing");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");
const { listingSchema,reviewSchema } = require("./schema.js");
const Review=require("./models/review");

const listings=require("./routes/listing.js");


const MONGO_URL='mongodb://127.0.0.1:27017/homify';

async function main() {
    await mongoose.connect(MONGO_URL);
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

app.get("/",(req,res)=>{
    res.send("hii,I am the Root");
});



const validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body); 
    if(error){   
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();   
    }
};

app.use("/listings",listings);

//Review Route
app.post("/listings/:id/reviews",validateReview,wrapAsync(async(req,res)=>{
    let listing=await Listing.findById(req.params.id);
    let newReview=new Review(req.body.review);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    console.log("New Review Added");
    res.redirect(`/listings/${listing._id}`);
}));

//Delete Review Route
app.delete("/listings/:id/reviews/:reviewId",wrapAsync(async(req,res)=>{
    let {id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    console.log("Review Deleted");
    res.redirect(`/listings/${id}`);
}));

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