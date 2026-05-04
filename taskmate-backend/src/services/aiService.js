import dotenv from "dotenv";
dotenv.config();

import Groq from "groq-sdk";

if (!process.env.GROQ_API_KEY) {
  console.error("❌ GROQ_API_KEY missing in .env file");
}

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const extractText = (completion) => {
  return completion?.choices?.[0]?.message?.content?.trim() || "";
};

export const improveTaskDescription = async (description) => {

  try {

    console.log("🟡 Original Description:", description);

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 200,
      messages: [
        {
          role: "system",
          content:
            "You rewrite task descriptions to make them clear, professional, and detailed."
        },
        {
          role: "user",
          content: `
Rewrite the following task description professionally.

Improve grammar, clarity and detail.

Return ONLY the improved description.

Task:
${description}
`
        }
      ]
    });

    const improved = extractText(completion);

    console.log("🟢 AI Improved Text:", improved);

    if (!improved || improved.toLowerCase() === description.toLowerCase()) {
      return `Develop a professional task based on this description: ${description}`;
    }

    return improved;

  } catch (error) {

    console.error("❌ AI Improve Error:", error);

    return description;

  }

};

export const detectToxicMessage = async (message) => {

  try {

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 0,
      max_tokens: 120,
      messages: [
        {
          role: "system",
          content:
            "You detect scam attempts, abusive language and inappropriate messages."
        },
        {
          role: "user",
          content: `
Analyze the following message.

Return JSON only:

{
  "flagged": true or false,
  "reason": ""
}

Message:
"${message}"
`
        }
      ]
    });

    const result = extractText(completion);

    try {
      return JSON.parse(result);
    } catch {
      return {
        flagged: false,
        reason: ""
      };
    }

  } catch (error) {

    console.error("❌ AI Chat Detection Error:", error);

    return {
      flagged: false,
      reason: ""
    };

  }

};

export const analyzeComplaint = async (text) => {

  try {

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 0,
      max_tokens: 150,
      messages: [
        {
          role: "system",
          content:
            "You analyze platform complaints for admin moderation."
        },
        {
          role: "user",
          content: `
Analyze this complaint.

Return JSON:

{
  "category": "",
  "severity": "Low | Medium | High",
  "suggestedAction": ""
}

Complaint:
${text}
`
        }
      ]
    });

    const result = extractText(completion);

    try {
      return JSON.parse(result);
    } catch {
      return {
        category: "Unknown",
        severity: "Low",
        suggestedAction: "Manual Review"
      };
    }

  } catch (error) {

    console.error("❌ AI Complaint Analysis Error:", error);

    return {
      category: "Unknown",
      severity: "Low",
      suggestedAction: "Manual Review"
    };

  }

};
