import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import Complaint from "../models/Complaint.js";
import Task from "../models/Task.js";

/* AI SERVICE */
import { analyzeComplaint } from "../services/aiService.js";

const router = express.Router();

/* ======================
CREATE COMPLAINT
CLIENT OR VOLUNTEER
====================== */

router.post("/", authMiddleware, async (req, res) => {

try {

const { taskId, message } = req.body;

const task = await Task.findById(taskId)
.populate("client volunteer");

if (!task)
return res.status(404).json({ message: "Task not found" });

let complainAgainstUser = null;

/* CLIENT complaining */

if (req.user.role === "client") {
complainAgainstUser = task.volunteer?._id;
}

/* VOLUNTEER complaining */

if (req.user.role === "volunteer") {
complainAgainstUser = task.client?._id;
}

/* ======================
AI COMPLAINT ANALYSIS
====================== */

let aiData = {
category: "",
severity: "",
suggestedAction: ""
};

try {

const aiResult = await analyzeComplaint(message);

const parsed = JSON.parse(aiResult);

aiData = {
category: parsed.category || "",
severity: parsed.severity || "",
suggestedAction: parsed.suggestedAction || ""
};

} catch (err) {

console.log("AI ANALYSIS FAILED:", err);

}

/* ======================
CREATE COMPLAINT
====================== */

const complaint = await Complaint.create({

task: taskId,

complainBy: req.user.id,

complainAgainst: complainAgainstUser,

message,

role: req.user.role,

aiCategory: aiData.category,
aiSeverity: aiData.severity,
aiSuggestedAction: aiData.suggestedAction,
aiAnalyzed: true

});

res.json({

message: "Complaint submitted",

complaint

});

} catch (error) {

console.log(error);

res.status(500).json({ message: "Complaint failed" });

}

});

/* ======================
GET ALL COMPLAINTS
ADMIN
====================== */

router.get("/", authMiddleware, async (req, res) => {

try {

if (req.user.role !== "admin")
return res.status(403).json({ message: "Admin only" });

const complaints = await Complaint.find()

.populate("complainBy", "name email role")

.populate("complainAgainst", "name email role")

.populate({
path: "task",
select: "title client volunteer",
populate: [
{
path: "client",
select: "name email"
},
{
path: "volunteer",
select: "name email"
}
]
})

.sort({ createdAt: -1 });

res.json(complaints);

} catch (error) {

console.log(error);

res.status(500).json({ message: "Failed to load complaints" });

}

});

/* ======================
DELETE COMPLAINT
ADMIN
====================== */

router.delete("/:id", authMiddleware, async (req, res) => {

try {

if (req.user.role !== "admin")
return res.status(403).json({ message: "Admin only" });

await Complaint.findByIdAndDelete(req.params.id);

res.json({
message: "Complaint deleted"
});

} catch (error) {

res.status(500).json({
message: "Delete failed"
});

}

});

export default router;