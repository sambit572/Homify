const Listing=require("../models/listing");


const maptilerSdk = require("@maptiler/client");


maptilerSdk.config.apiKey = process.env.MAPTILER_KEY;

module.exports.index=async(req,res)=>{
    const allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings});
};

module.exports.renderNewForm=(req,res)=>{
    res.render("listings/new.ejs");
};

module.exports.showListing=async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id).populate({path:"reviews",populate:{path:"author"},}).populate("owner");
    if(!listing){
        req.flash("error","Cannot find that listing!");
        return res.redirect("/listings");  
    }
    console.log(listing);
    res.render("listings/show.ejs",{listing}); 
};

module.exports.createListing=async(req,res,next)=>{
    const newListing=new Listing(req.body.listing);
    let url=req.file.path;
    let filename=req.file.filename;
    newListing.image={url,filename};
    
    //newListing.owner=req.user._id;   
    await newListing.save();
    req.flash("success","Successfully made a new listing!");
    res.redirect("/listings");
};

module.exports.editListing=async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    if(!listing){
        req.flash("error","Cannot find that listing!");
        return res.redirect("/listings");  
    }
    let originalImageUrl=listing.image.url;
    originalImageUrl=originalImageUrl.replace("/upload","/upload/h_300,w_250");
    res.render("listings/edit.ejs",{listing,originalImageUrl});
};

module.exports.updateListing=async(req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});
    if(typeof req.file !== 'undefined'){
        let url=req.file.path;
        let filename=req.file.filename;
        listing.image={url,filename};
        await listing.save();
    }
    req.flash("success","Successfully updated the listing!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing=async(req,res)=>{
    let {id}=req.params;
    let deletedListing=await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","Successfully deleted the listing!");
    res.redirect("/listings");
};