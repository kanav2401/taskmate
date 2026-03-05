import express from "express";
import { improveTaskDescription } from "../services/aiService.js";

const router = express.Router();

router.post("/improve-task", async (req, res) => {
  try {
    const { description } = req.body;

    const improved = await improveTaskDescription(description);

    res.json({ improved });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "AI error" });
  }
});

export default router;