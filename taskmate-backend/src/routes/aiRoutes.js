import express from "express";
import { improveTaskDescription } from "../services/aiService.js";

const router = express.Router();

/* ===============================
   IMPROVE TASK DESCRIPTION
=============================== */

router.post("/improve-task", async (req, res) => {

  try {

    const { description } = req.body;

    if (!description || description.trim() === "") {
      return res.status(400).json({
        message: "Description is required"
      });
    }

    const improved = await improveTaskDescription(description);

    if (!improved) {
      return res.status(500).json({
        message: "AI could not improve description"
      });
    }

    res.json({
      improved
    });

  } catch (err) {

    console.error("AI Route Error:", err);

    res.status(500).json({
      message: "AI error"
    });

  }

});

export default router;