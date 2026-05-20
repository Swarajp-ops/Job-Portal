import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini AI Client
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  // API Route to search for jobs all over India via secure server-side Gemini generation
  app.post("/api/search-external-jobs", async (req, res) => {
    const { query = "", location = "" } = req.body;
    
    try {
      // Formulate detailed, contextual prompt requesting Indian specific positions
      const prompt = `Generate a structured list of 6 highly realistic, professional, and currently active job or internship openings in the Indian tech, healthcare, finance, enterprise SaaS, retail, or product ecosystem that correspond to query keywords "${query}" and Indian city/region filter "${location}". 
      
      Requirements for generation:
      - All jobs MUST be specifically situated in recognized Indian business hubs: e.g. Bengaluru (KA), Mumbai (MH), Gurugram (HR), Chennai (TN), Pune (MH), Hyderabad (TS), Noida (UP), Delhi (DL), Kolkata (WB), Jaipur (RJ).
      - Do not use generic American states or cities.
      - Salaries must be denoted in standard Indian formats like "₹12L - ₹18L LPA" (annual Lakhs) or monthly stipends like "₹25,000 / month" for internships.
      - Associate each job with prominent companies operating in India, such as: Swiggy, Paytm, CRED, PhonePe, Infosys, Wipro, TCS, Zoho Corporation, Razorpay, Zepto, Zerodha, Blinkit, Nykaa, Flipkart, Tata Motors, or HDFC Bank.
      - Provide authentic Unsplash photo URLs for corporate/brand visual mockups (e.g., modern offices, abstract corporate brand emblems).
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
                id: { type: Type.STRING, description: "A unique string ID, formatted like ext-job-xxxx" },
                title: { type: Type.STRING, description: "Professional job title, e.g. Lead SRE Engineer, Performance Marketing Lead, Product Analyst" },
                companyName: { type: Type.STRING, description: "Corporate brand operating in Indian hubs" },
                companyLogo: { type: Type.STRING, description: "Professional logo image URL from Unsplash e.g. https://images.unsplash.com/photo-1571171637578-41bc2dd4dcd2?w=100&h=100&fit=crop&q=80" },
                location: { type: Type.STRING, description: "City and Indian state, e.g. Bengaluru, KA or Hyderabad, TS" },
                workMode: { type: Type.STRING, enum: ["remote", "hybrid", "on-site"], description: "Work structure" },
                type: { type: Type.STRING, enum: ["full-time", "part-time", "internship", "contract"], description: "Employment type" },
                salaryRange: { type: Type.STRING, description: "Realistic Indian compensation range (LPA or monthly stipend)" },
                description: { type: Type.STRING, description: "A detailed 2-3 sentence overview describing the role's strategic focus, team size, and immediate impact metrics." },
                requirements: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "3-4 technical or professional qualifications (e.g. Node.js mastery, MBA Marketing, SQL queries)"
                },
                responsibilities: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "3-4 major daily operational objectives or project targets"
                },
                skills: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "4-5 primary skill tags or keyword clusters"
                },
                website: { type: Type.STRING, description: "Corporate portal URL" },
                postedDate: { type: Type.STRING, description: "A recent posting date in YYYY-MM-DD format (like 2026-05-19)" }
              },
              required: ["id", "title", "companyName", "companyLogo", "location", "workMode", "type", "salaryRange", "description", "requirements", "responsibilities", "skills", "postedDate"]
            }
          }
        }
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
        error: error.message 
      });
    }
  });

  // Health probe endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "healthy", timestamp: new Date().toISOString() });
  });

  // Integrate Vite Dev Middleware in development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve production static assets compiled under dist/ folder
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[CareerBridge Server] Running on http://0.0.0.0:${PORT} in ${process.env.NODE_ENV || "development"} mode.`);
  });
}

startServer().catch((err) => {
  console.error("Critical error starting CareerBridge fullstack system:", err);
});
