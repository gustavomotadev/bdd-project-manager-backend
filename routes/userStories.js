const express = require("express");
const { PrismaClient } = require("@prisma/client");

const router = express.Router({ mergeParams: true });
const prisma = new PrismaClient();

// ── GET /projects/:projectId/user-stories ────────────────────────────────────
// List all user stories for a project
router.get("/", async (req, res) => {
  const projectId = Number(req.params.projectId);

  try {
    const userStories = await prisma.userStory.findMany({
      where: { projectId },
      orderBy: { code: "asc" },
    });
    res.json(userStories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── GET /projects/:projectId/user-stories/:id ────────────────────────────────
// Get a single user story by ID
router.get("/:id", async (req, res) => {
  const projectId = Number(req.params.projectId);
  const id = Number(req.params.id);

  try {
    const userStory = await prisma.userStory.findFirst({
      where: { id, projectId },
    });
    if (!userStory) return res.status(404).json({ error: "User story not found" });
    res.json(userStory);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── POST /projects/:projectId/user-stories ───────────────────────────────────
// Create a new user story under a project
router.post("/", async (req, res) => {
  const projectId = Number(req.params.projectId);
  const { code, title, asA, iWant, soThat, priority, status } = req.body;

  if (!code || !title || !asA || !iWant || !soThat || !priority || !status) {
    return res.status(400).json({
      error: "Fields 'code', 'title', 'asA', 'iWant', 'soThat', 'priority', and 'status' are required",
    });
  }

  try {
    const userStory = await prisma.userStory.create({
      data: { code, title, asA, iWant, soThat, priority, status, projectId },
    });
    res.status(201).json(userStory);
  } catch (err) {
    if (err.code === "P2003") {
      return res.status(404).json({ error: "Project not found" });
    }
    if (err.code === "P2002") {
      return res.status(409).json({ error: `A user story with code '${code}' already exists in this project` });
    }
    res.status(500).json({ error: err.message });
  }
});

// ── PATCH /projects/:projectId/user-stories/:id ──────────────────────────────
// Partially update a user story
router.patch("/:id", async (req, res) => {
  const projectId = Number(req.params.projectId);
  const id = Number(req.params.id);
  const { code, title, asA, iWant, soThat, priority, status } = req.body;

  try {
    const userStory = await prisma.userStory.update({
      where: { id, projectId },
      data: {
        ...(code     !== undefined && { code }),
        ...(title    !== undefined && { title }),
        ...(asA      !== undefined && { asA }),
        ...(iWant    !== undefined && { iWant }),
        ...(soThat   !== undefined && { soThat }),
        ...(priority !== undefined && { priority }),
        ...(status   !== undefined && { status }),
      },
    });
    res.json(userStory);
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ error: "User story not found" });
    }
    if (err.code === "P2002") {
      return res.status(409).json({ error: `A user story with code '${code}' already exists in this project` });
    }
    res.status(500).json({ error: err.message });
  }
});

// ── DELETE /projects/:projectId/user-stories/:id ─────────────────────────────
// Delete a user story (cascades to AcceptanceCriteria via schema)
router.delete("/:id", async (req, res) => {
  const projectId = Number(req.params.projectId);
  const id = Number(req.params.id);

  try {
    await prisma.userStory.delete({
      where: { id, projectId },
    });
    res.status(204).send();
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ error: "User story not found" });
    }
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;