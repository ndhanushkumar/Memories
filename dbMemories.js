import mongoose from "mongoose";

const MemoriesSchema=mongoose.Schema({
    creator:String,
    title:String,
    message:String,
    image:String,
    tags:String,
    like:Number
});

export default mongoose.model("memories",MemoriesSchema);
