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
app.set("views",path.join(__dirname,"views"))

app.get("/",(req,res)=>{
    res.send("hii,I am the Root");
});

//Index Route
app.get("/listings",async(req,res)=>{
    const allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings});
});

// app.get("/testlisting",async(req,res)=>{
//     let sampleListing=new Listing({
//         title:"my sweet home",
//         description:"it is the most beautiful place",
//         price:3000,
//         location:"bhadrak",
//         country:"INDIA"
//     })
//     await sampleListing.save();    
//     console.log("connected to db");
//     res.send("successful");
// })

app.listen(8080,()=>{
    console.log("Server is running on port 8080");
});