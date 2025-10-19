const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing=require("./models/listing");
const path=require("path");

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

app.get("/",(req,res)=>{
    res.send("hii,I am the Root");
});

//Index Route
app.get("/listings",async(req,res)=>{
    const allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings});
});

//new route
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");
});

//Show Route
app.get("/listings/:id",async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("listings/show.ejs",{listing}); 
});

app.post("/listings",async(req,res)=>{
    let listing=req.body;
    console.log(listing);
});

app.listen(8080,()=>{
    console.log("Server is running on port 8080");
});