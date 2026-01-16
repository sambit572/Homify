const mongoose=require("mongoose");
const initData=require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL='mongodb://127.0.0.1:27017/homify';

async function main() {
    await mongoose.connect(MONGO_URL);
}

main().then(()=>{
    console.log("mongodb are connected");
}).catch(err=>{
    console.log(err);
});

const initDB=async()=>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=>({...obj,owner:"694168faea94a2efd7486a65"}));
    await Listing.insertMany(initData.data);
    console.log("data was saved");    
}

initDB();
