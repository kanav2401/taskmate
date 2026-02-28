import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema(
{
task:{
type:mongoose.Schema.Types.ObjectId,
ref:"Task"
},

complainBy:{
type:mongoose.Schema.Types.ObjectId,
ref:"User"
},

complainAgainst:{
type:mongoose.Schema.Types.ObjectId,
ref:"User"
},

message:{
type:String,
required:true
},

role:{
type:String
},

status:{
type:String,
default:"pending"
}

},
{timestamps:true}
);

export default mongoose.model("Complaint",complaintSchema);