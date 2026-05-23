import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;
  const isProduction = process.env.NODE_ENV === "production";

  app.use(express.json());

  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

  const ai = GEMINI_API_KEY
    ? new GoogleGenAI({
        apiKey: GEMINI_API_KEY,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      })
    : null;

  app.post("/api/search-external-jobs", async (req, res) => {
    const { query = "", location = "" } = req.body;

    if (!ai) {
      return res.status(500).json({
        success: false,
        message: "GEMINI_API_KEY is not configured on the server.",
      });
    }

    try {
      const prompt = `Generate a structured list of 6 highly realistic, professional, and currently active job or internship openings in the Indian tech, healthcare, finance, enterprise SaaS, retail, or product ecosystem that correspond to query keywords "${query}" and Indian city/region filter "${location}".

Requirements for generation:
- All jobs MUST be specifically situated in recognized Indian business hubs: e.g. Bengaluru (KA), Mumbai (MH), Gurugram (HR), Chennai (TN), Pune (MH), Hyderabad (TS), Noida (UP), Delhi (DL), Kolkata (WB), Jaipur (RJ).
- Do not use generic American states or cities.
- Salaries must be denoted in standard Indian formats like "₹12L - ₹18L LPA" or "₹25,000 / month" for internships.
- Associate each job with prominent companies operating in India.
- Provide authentic Unsplash photo URLs for corporate/brand visual mockups.
- Return the fields strictly matched with the requested JSON schema.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                title: { type: Type.STRING },
                companyName: { type: Type.STRING },
                companyLogo: { type: Type.STRING },
                location: { type: Type.STRING },
                workMode: { type: Type.STRING, enum: ["remote", "hybrid", "on-site"] },
                type: { type: Type.STRING, enum: ["full-time", "part-time", "internship", "contract"] },
                salaryRange: { type: Type.STRING },
                description: { type: Type.STRING },
                requirements: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                responsibilities: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                skills: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                website: { type: Type.STRING },
                postedDate: { type: Type.STRING },
              },
              required: [
                "id",
                "title",
                "companyName",
                "companyLogo",
                "location",
                "workMode",
                "type",
                "salaryRange",
                "description",
                "requirements",
                "responsibilities",
                "skills",
                "postedDate",
              ],
            },
          },
        },
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error("Empty text response received from Gemini model.");
      }

      const parsedJobs = JSON.parse(responseText.trim());
      res.json({ success: true, jobs: parsedJobs });
    } catch (error: any) {
      console.error("Failed to query external Indian job profiles:", error);
      res.status(500).json({
        success: false,
        message: "Failed to load external Indian jobs database. Please check your system configuration.",
        error: error.message,
      });
    }
  });

  app.get("/api/health", (_req, res) => {
    res.json({ status: "healthy", timestamp: new Date().toISOString() });
  });

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(
      `[CareerBridge Server] Running on http://localhost:${PORT} in ${process.env.NODE_ENV || "development"} mode.`
    );
  });
}

startServer().catch((err) => {
  console.error("Critical error starting CareerBridge fullstack system:", err);
});