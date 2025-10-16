const express=require("express");
const app=express();
const mongoose=require("mongoose");

const MONGO_URL='mongodb://127.0.0.1:27017/homify';

async function main() {
    await mongoose.connect(MONGO_URL);
}

main().then(()=>{
    console.log("mongodb are connected");
}).catch(err=>{
    console.log(err);
});

app.get("/",(req,res)=>{
    res.send("hii,I am the Root");
})
app.listen(8080,()=>{
    console.log("Server is running on port 8080");
});