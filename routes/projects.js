const express = require("express");
const { PrismaClient } = require("@prisma/client");

const router = express.Router();
const prisma = new PrismaClient();

// ── GET /projects ────────────────────────────────────────────────────────────
// List all projects, newest first
router.get("/", async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── GET /projects/:id ────────────────────────────────────────────────────────
// Get a single project by ID
router.get("/:id", async (req, res) => {
  try {
    const project = await prisma.project.findUnique({
      where: { id: Number(req.params.id) },
    });
    if (!project) return res.status(404).json({ error: "Project not found" });
    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── POST /projects ───────────────────────────────────────────────────────────
// Create a new project
router.post("/", async (req, res) => {
  const { code, name, description } = req.body;

  if (!code || !name) {
    return res.status(400).json({ error: "Fields 'code' and 'name' are required" });
  }

  try {
    const project = await prisma.project.create({
      data: { code, name, description },
    });
    res.status(201).json(project);
  } catch (err) {
    if (err.code === "P2002") {
      return res.status(409).json({ error: `A project with code '${code}' already exists` });
    }
    res.status(500).json({ error: err.message });
  }
});

// ── PATCH /projects/:id ──────────────────────────────────────────────────────
// Partially update a project (only send fields you want to change)
router.patch("/:id", async (req, res) => {
  const { code, name, description } = req.body;

  try {
    const project = await prisma.project.update({
      where: { id: Number(req.params.id) },
      data: {
        ...(code        !== undefined && { code }),
        ...(name        !== undefined && { name }),
        ...(description !== undefined && { description }),
      },
    });
    res.json(project);
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ error: "Project not found" });
    }
    if (err.code === "P2002") {
      return res.status(409).json({ error: `A project with code '${code}' already exists` });
    }
    res.status(500).json({ error: err.message });
  }
});

// ── DELETE /projects/:id ─────────────────────────────────────────────────────
// Delete a project (cascades to Requirements and UserStories via schema)
router.delete("/:id", async (req, res) => {
  try {
    await prisma.project.delete({
      where: { id: Number(req.params.id) },
    });
    res.status(204).send();
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ error: "Project not found" });
    }
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;