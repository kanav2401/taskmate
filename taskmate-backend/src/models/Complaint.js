import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema(
{
task:{
type:mongoose.Schema.Types.ObjectId,
ref:"Task"
},

client:{
type:mongoose.Schema.Types.ObjectId,
ref:"User"
},

volunteer:{
type:mongoose.Schema.Types.ObjectId,
ref:"User"
},

message:{
type:String,
required:true
},

status:{
type:String,
default:"pending"
}

},
{timestamps:true}
);

export default mongoose.model("Complaint",complaintSchema);