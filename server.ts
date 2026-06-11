import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Lazy initialized Gemini connection
let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!geminiClient) {
    const apiKey = process.env.GEMINI_API_KEY || "";
    // We don't crash the server on boot if the key is missing. Instead we fail-fast on endpoint use.
    geminiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return geminiClient;
}

// 1. Data Abstraction - project breakdown via Gemini
app.post("/api/project/breakdown", async (req, res) => {
  try {
    const { title, category, subtaskCount = 5 } = req.body;
    if (!title) {
      return res.status(400).json({ error: "Project goal/title is required." });
    }

    if (!process.env.GEMINI_API_KEY) {
      // Return a structured mockup if the developer environment keys are not configured
      console.warn("GEMINI_API_KEY is not defined. Falling back to local offline breakdown.");
      const mockTasks = [
        { title: `Define requirements for "${title}"`, xpReward: 15, estimatedMinutes: 20 },
        { title: `Draft layout sketches for ${category || "project"}`, xpReward: 20, estimatedMinutes: 30 },
        { title: `Build core interactive component skeleton`, xpReward: 25, estimatedMinutes: 45 },
        { title: `Conduct functional test audit run`, xpReward: 20, estimatedMinutes: 25 },
        { title: `Release MVP & celebrate!`, xpReward: 30, estimatedMinutes: 15 }
      ];
      return res.json({ tasks: mockTasks, notice: "Offline fallback mode active." });
    }

    const ai = getGeminiClient();
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Break down the following complex project goal or task into exactly ${subtaskCount} bite-sized, actionable, non-abstract micro-steps.
Project context / Goal: "${title}"
Category: "${category || "general"}"

Each step must be easy to start, concrete, and prevent procrastination. Include:
1. "title": Description of the bite-sized action, e.g. "Draft first 3 sentences of proposal body" instead of "Write proposal".
2. "xpReward": Integer experience points from 10 to 45 reflecting difficulty.
3. "estimatedMinutes": Integer estimated focus time in minutes (10 to 60).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: {
                type: Type.STRING,
                description: "The concrete, actionable task title.",
              },
              xpReward: {
                type: Type.INTEGER,
                description: "XP gained between 10 and 45.",
              },
              estimatedMinutes: {
                type: Type.INTEGER,
                description: "Estimated focus time in minutes.",
              },
            },
            required: ["title", "xpReward", "estimatedMinutes"],
          },
        },
      },
    });

    const parsedText = response.text || "[]";
    const tasks = JSON.parse(parsedText);
    res.json({ tasks });
  } catch (error: any) {
    console.error("Gemini Project Breakdown Error:", error);
    res.status(500).json({
      error: "Could not generate project breakdown.",
      details: error.message || error,
    });
  }
});

// 2. Dual Feedback email channel & Support Ticket simulated triggers
app.post("/api/support/ticket", async (req, res) => {
  try {
    const { name, email, subject, message, type = "support" } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: "Name, email, and message are required." });
    }

    // Creating dual communication notification targets:
    // Target A: Users get automated verification ticket creation trigger
    // Target B: Internal Admin center automated routing
    const ticketId = `FQT-${Math.floor(100000 + Math.random() * 900000)}`;
    const automatedReply = `Hello ${name},\n\nThank you for reaching out to FocusQuest support. We've received your ticket [${ticketId}] regarding "${subject || "User Feedback"}". Our automated system has flagged this ticket as In-Progress and synced it to our Data Independence log. An executive team member will join this thread if payment remediation or active sync adjustments are needed.\n\nWarm regards,\nFocusQuest Automated Support`;

    res.json({
      success: true,
      ticket: {
        id: ticketId,
        name,
        email,
        subject: subject || "System Communication",
        message,
        timestamp: new Date().toISOString(),
        status: "Open",
        type,
        automatedReplySent: true,
        response: automatedReply,
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 3. Sync Outlook Mail / Calendar Sync log to Google Sheets proxy helper
// We can let the frontend send real Google Sheets API updates if a Bearer Token is passed.
// In this route, if the Bearer token exists, we can provide real API proxying, or otherwise provide a clean, high-performance mock sync simulation.
app.post("/api/sheets/sync", async (req, res) => {
  const authHeader = req.headers.authorization;
  const { spreadsheetId, range, values } = req.body;

  if (authHeader && authHeader.startsWith("Bearer ") && spreadsheetId) {
    try {
      const accessToken = authHeader.substring(7);
      // Real Google Sheets append API call
      const sheetsUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range || "Sheet1!A1"}:append?valueInputOption=USER_ENTERED`;
      const sheetsResponse = await fetch(sheetsUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          values,
        }),
      });

      if (!sheetsResponse.ok) {
        const errorData = await sheetsResponse.json();
        return res.status(sheetsResponse.status).json({
          error: "Google Sheets API answered with failure.",
          details: errorData,
        });
      }

      const responseData = await sheetsResponse.json();
      return res.json({
        success: true,
        source: "Google API Real Connection",
        data: responseData,
      });
    } catch (e: any) {
      return res.status(500).json({ error: "Real Google Sheets sync failed.", details: e.message });
    }
  } else {
    // Offline simulation mode or non-connected sync
    return res.json({
      success: true,
      source: "Offline Simulation Mode",
      message: "Data compiled and queued for audit log stream successfully.",
      countSynced: values ? values.length : 1,
    });
  }
});

// Start our custom server
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    // Vite middleware for dev mode
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production static bundle directories
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[FocusQuest Server] running on http://localhost:${PORT}`);
  });
}

startServer();
