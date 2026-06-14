const express = require("express");
const { PrismaClient } = require("@prisma/client");
const projectsRouter = require("./routes/projects");

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/projects", projectsRouter);

// ── Diagnostics endpoint ────────────────────────────────────────────────────
app.get("/diagnostics", async (req, res) => {
  try {
    // Run a lightweight query on each model to confirm DB connectivity
    const [projectCount, requirementCount, userStoryCount, criterionCount] =
      await Promise.all([
        prisma.project.count(),
        prisma.requirement.count(),
        prisma.userStory.count(),
        prisma.acceptanceCriterion.count(),
      ]);

    res.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      server: {
        port: PORT,
        nodeVersion: process.version,
        uptime: `${Math.floor(process.uptime())}s`,
      },
      database: {
        provider: "sqlite",
        connected: true,
        recordCounts: {
          projects: projectCount,
          requirements: requirementCount,
          userStories: userStoryCount,
          acceptanceCriteria: criterionCount,
        },
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
});

// ── Start ───────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Diagnostics: http://localhost:${PORT}/diagnostics`);
});