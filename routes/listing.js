const express = require('express');
const router = express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const Listing=require("../models/listing");
const { isLoggedIn,validateListing } = require("../middleware.js");

//Index Route
router.get("/",wrapAsync(async(req,res)=>{
    const allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings});
}));  

//new route
router.get("/new",(req,res)=>{
    res.render("listings/new.ejs");
});

// Show Route
router.get("/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id).populate({path:"reviews",populate:{path:"author"},}).populate("owner");
    if(!listing){
        req.flash("error","Cannot find that listing!");
        return res.redirect("/listings");  
    }
    console.log(listing);
    res.render("listings/show.ejs",{listing}); 
}));

//Create Route
router.post("/",validateListing,wrapAsync(async(req,res,next)=>{
    const newListing=new Listing(req.body.listing);
    //newListing.owner=req.user._id;   
    await newListing.save();
    req.flash("success","Successfully made a new listing!");
    res.redirect("/listings");
}));

//Edit Route
router.get("/:id/edit",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    if(!listing){
        req.flash("error","Cannot find that listing!");
        return res.redirect("/listings");  
    }
    res.render("listings/edit.ejs",{listing});
}));

//Update Route
router.put("/:id",validateListing,wrapAsync(async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success","Successfully updated the listing!");
    res.redirect(`/listings/${id}`);
}));

//Delete Route
router.delete("/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    let deletedListing=await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","Successfully deleted the listing!");
    res.redirect("/listings");
}));

module.exports = router;