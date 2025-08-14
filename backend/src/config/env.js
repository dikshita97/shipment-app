export const config = {
    port: process.env.PORT || 4000,
    jwtSecret: process.env.JWT_SECRET,
    corsOrigin: process.env.CORS_ORIGIN || "http://localhost:5173",
    geminiKey: process.env.GEMINI_API_KEY,
  };
  