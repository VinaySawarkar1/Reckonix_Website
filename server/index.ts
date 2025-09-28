import 'dotenv/config';
import express, { type Request, Response, NextFunction } from "express";
import path from "path";

// Console log removed for production);
// Console log removed for production

const app = express();
// Increase body size limits for file uploads
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: false, limit: '100mb' }));

// Serve uploads directory for product images
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Serve client public directory for media files (videos, images)
app.use(express.static(path.join(process.cwd(), 'client/public')));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      // Console log removed for production
    }
  });

  next();
});

(async () => {
  const { registerRoutes } = await import("./routes");
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // Serve static files in production
  const distPath = path.resolve(process.cwd(), 'client/dist');
  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist
  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });

  // Use Railway's PORT environment variable or default to 5001
  const port = process.env.PORT || 5001;
  server.listen({
    port,
    host: "0.0.0.0", // Allow external connections
  }, () => {
    // Console log removed for production
  });
})();
