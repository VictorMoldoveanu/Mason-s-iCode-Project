import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { InferenceClient } from "@huggingface/inference";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

if (!process.env.HF_TOKEN) {
  console.error("ERROR: HF_TOKEN is missing from .env");
  process.exit(1);
}

const hf = new InferenceClient(process.env.HF_TOKEN);

app.use(cors());
app.use(express.json({ limit: "2mb" }));

// ============================================
// MODELS
// ============================================

const CHAT_MODEL = "Qwen/Qwen3-4B-Instruct-2507";

const CODE_MODEL = "Qwen/Qwen2.5-Coder-32B-Instruct";

const IMAGE_MODEL = "black-forest-labs/FLUX.1-schnell";

// ============================================
// HEALTH CHECK
// ============================================

app.get("/api/health", (req, res) => {
  res.json({
    status: "online",
    service: "Codie AI Backend",
  });
});

// ============================================
// CHAT API
// ============================================

app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        error: "Messages are required.",
      });
    }

    const hfMessages = messages.map((message) => ({
      role: message.role === "ai" ? "assistant" : message.role,
      content: message.text || message.content || "",
    }));

    const completion = await hf.chatCompletion({
      model: CHAT_MODEL,
      messages: [
        {
          role: "system",
          content:
            "You are Codie AI, a helpful, friendly AI assistant. Explain things clearly and make AI accessible to beginners.",
        },
        ...hfMessages,
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const response =
      completion.choices?.[0]?.message?.content ||
      "I wasn't able to generate a response.";

    res.json({
      response,
    });
  } catch (error) {
    console.error("CHAT ERROR:", error);

    res.status(500).json({
      error: "The AI chatbot could not process your request.",
      details: error.message,
    });
  }
});

// ============================================
// CODE AI API
// ============================================

app.post("/api/code", async (req, res) => {
  try {
    const {
      code = "",
      question = "",
      action = "ask",
      language = "JavaScript",
    } = req.body;

    let instruction = "";

    if (action === "explain") {
      instruction = `
Explain the following ${language} code to a beginner.

Code:

${code}

Explain:
1. What the code does
2. What each important part does
3. Any concepts the beginner should understand

Keep the explanation clear and practical.
`;
    } else if (action === "bugs") {
      instruction = `
Analyze this ${language} code for bugs.

Code:

${code}

Look for:
1. Syntax errors
2. Logic errors
3. Runtime problems
4. Bad practices

If there are no obvious bugs, say so.

Give specific fixes where appropriate.
`;
    } else if (action === "optimize") {
      instruction = `
Review this ${language} code and suggest improvements.

Code:

${code}

Look for:
1. Readability
2. Performance
3. Maintainability
4. Simplicity
5. Better programming practices

Explain why each improvement helps.
`;
    } else {
      instruction = `
You are the Codie AI Coding Assistant.

The programming language is ${language}.

Here is the user's code:

${code}

The user's question is:

${question}

Answer the question specifically about the supplied code.

If you provide replacement code, use a code block.
`;
    }

    const completion = await hf.chatCompletion({
      model: CODE_MODEL,
      messages: [
        {
          role: "system",
          content:
            "You are an expert programming assistant who explains programming clearly to beginners.",
        },
        {
          role: "user",
          content: instruction,
        },
      ],
      max_tokens: 900,
      temperature: 0.2,
    });

    const response =
      completion.choices?.[0]?.message?.content ||
      "I wasn't able to analyze the code.";

    res.json({
      response,
    });
  } catch (error) {
    console.error("CODE ERROR:", error);

    res.status(500).json({
      error: "The coding AI could not process your request.",
      details: error.message,
    });
  }
});

// ============================================
// IMAGE API
// ============================================

app.post("/api/image", async (req, res) => {
  try {
    const {
      prompt,
      aspectRatio = "16:9",
      style = "Cinematic",
    } = req.body;

    if (!prompt || !prompt.trim()) {
      return res.status(400).json({
        error: "An image prompt is required.",
      });
    }

    let width = 1024;
    let height = 576;

    if (aspectRatio === "1:1") {
      width = 768;
      height = 768;
    }

    if (aspectRatio === "9:16") {
      width = 576;
      height = 1024;
    }

    const enhancedPrompt = `
${prompt.trim()}

Visual style: ${style}.
High quality, detailed, polished composition.
`;

    const image = await hf.textToImage({
      model: IMAGE_MODEL,
      inputs: enhancedPrompt,
      parameters: {
        width,
        height,
      },
    });

    const arrayBuffer = await image.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    res.set("Content-Type", image.type || "image/png");

    res.send(buffer);
  } catch (error) {
    console.error("IMAGE ERROR:", error);

    res.status(500).json({
      error: "The image generator could not create the image.",
      details: error.message,
    });
  }
});

// ============================================
// START SERVER
// ============================================

app.listen(PORT, () => {
  console.log(`Codie backend running on http://localhost:${PORT}`);
});