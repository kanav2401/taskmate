import dotenv from "dotenv";
dotenv.config();

import Groq from "groq-sdk";

/* ===============================
   INITIALIZE GROQ CLIENT
=============================== */

if (!process.env.GROQ_API_KEY) {
  console.error("❌ GROQ_API_KEY missing in .env file");
}

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

/* ===============================
   AI TASK DESCRIPTION IMPROVER
=============================== */

export const improveTaskDescription = async (description) => {
  try {
    const prompt = `
Improve the following task description to make it clear, professional, and detailed.

Task:
${description}
`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama3-8b-8192",
    });

    return completion.choices[0].message.content;

  } catch (error) {
    console.error("AI Improve Error:", error);
    return description;
  }
};

/* ===============================
   AI TOXIC / SCAM MESSAGE DETECTION
=============================== */

export const detectToxicMessage = async (message) => {
  try {

    const prompt = `
Check if this message contains scam attempts, abusive language, cheating requests, or inappropriate content.

Message:
"${message}"

Return JSON format:

{
  "flagged": true/false,
  "reason": "reason if flagged"
}
`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama3-8b-8192",
    });

    return completion.choices[0].message.content;

  } catch (error) {
    console.error("AI Chat Detection Error:", error);

    return JSON.stringify({
      flagged: false,
      reason: ""
    });
  }
};

/* ===============================
   AI COMPLAINT ANALYZER
=============================== */

export const analyzeComplaint = async (text) => {
  try {

    const prompt = `
Analyze the complaint below.

Return JSON:

{
  "category": "",
  "severity": "Low/Medium/High",
  "suggestedAction": ""
}

Complaint:
${text}
`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama3-8b-8192",
    });

    return completion.choices[0].message.content;

  } catch (error) {
    console.error("AI Complaint Analysis Error:", error);

    return JSON.stringify({
      category: "Unknown",
      severity: "Low",
      suggestedAction: "Manual Review"
    });
  }
};