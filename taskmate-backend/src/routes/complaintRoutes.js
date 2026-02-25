import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import Complaint from "../models/Complaint.js";
import Task from "../models/Task.js";

const router = express.Router();


/* ======================
CREATE COMPLAINT (CLIENT)
====================== */

router.post("/",authMiddleware,async(req,res)=>{

try{

if(req.user.role!=="client")
return res.status(403).json({message:"Only clients can complain"});

const {taskId,message}=req.body;

const task=await Task.findById(taskId);

if(!task)
return res.status(404).json({message:"Task not found"});


const complaint=await Complaint.create({

task:taskId,
client:req.user.id,
volunteer:task.volunteer,
message

});


res.json({
message:"Complaint submitted",
complaint
});


}catch(error){

res.status(500).json({message:"Complaint failed"});

}

});



/* ======================
GET COMPLAINTS (ADMIN)
====================== */

router.get("/",authMiddleware,async(req,res)=>{

if(req.user.role!=="admin")
return res.status(403).json({message:"Admin only"});


const complaints=await Complaint.find()
.populate("client","name email")
.populate("volunteer","name email")
.populate("task","title")
.sort({createdAt:-1});


res.json(complaints);

});



/* ======================
DELETE COMPLAINT
====================== */

router.delete("/:id",authMiddleware,async(req,res)=>{

if(req.user.role!=="admin")
return res.status(403).json({message:"Admin only"});

await Complaint.findByIdAndDelete(req.params.id);

res.json({message:"Complaint deleted"});

});



export default router;