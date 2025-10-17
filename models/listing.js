const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const listingSchema=new Schema({
    title:{
        type:String,
        required:true
    },
    description:String,
    image:{
        filename:{
            type:String,
            default:"listingimage"
        },
        url:{
            type:String,
            default:"https://images.unsplash.com/photo-1760442936485-b26b087c2030?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxNXx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=60&w=600",
            set:(v)=>v===""?"https://images.unsplash.com/photo-1760442936485-b26b087c2030?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxNXx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=60&w=600":v
    
        }
    },
    price:Number,
    location:String,
    country:String
});

const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;