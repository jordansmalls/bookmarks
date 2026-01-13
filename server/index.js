import express from "express";
import config from "./src/config/config.js";
import connectDB from "./src/config/db.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import auth from "./src/routes/auth.routes.js";
import bookmarks from "./src/routes/bookmark.routes.js";

connectDB();
const app = express();

app.use(morgan(config.node_env === "production" ? "combined" : "dev"));
app.use(express.json());
app.use(cookieParser());
app.use(cors(config.cors_options));
app.use("/api/auth", auth);
app.use("/api/bookmarks", bookmarks);

app.get("/", (req, res) => {
  res.send("API IS LIVE");
});

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: process.version,
  });
});

app.listen(config.port, () =>
  console.log(`LIVE ON HTTP://localhost:${config.port}`),
);
