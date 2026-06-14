const express = require("express");
const { PrismaClient } = require("@prisma/client");

const router = express.Router({ mergeParams: true }); // mergeParams gives access to :projectId from parent route
const prisma = new PrismaClient();

// ── GET /projects/:projectId/requirements ────────────────────────────────────
// List all requirements for a project
router.get("/", async (req, res) => {
  const projectId = Number(req.params.projectId);

  try {
    const requirements = await prisma.requirement.findMany({
      where: { projectId },
      orderBy: { code: "asc" },
    });
    res.json(requirements);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── GET /projects/:projectId/requirements/:id ────────────────────────────────
// Get a single requirement by ID
router.get("/:id", async (req, res) => {
  const projectId = Number(req.params.projectId);
  const id = Number(req.params.id);

  try {
    const requirement = await prisma.requirement.findFirst({
      where: { id, projectId },
    });
    if (!requirement) return res.status(404).json({ error: "Requirement not found" });
    res.json(requirement);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── POST /projects/:projectId/requirements ───────────────────────────────────
// Create a new requirement under a project
router.post("/", async (req, res) => {
  const projectId = Number(req.params.projectId);
  const { code, description, isFunctional, category, priority, status } = req.body;

  if (!code || !description || !category || !priority || !status) {
    return res.status(400).json({
      error: "Fields 'code', 'description', 'category', 'priority', and 'status' are required",
    });
  }

  try {
    const requirement = await prisma.requirement.create({
      data: {
        code,
        description,
        isFunctional: isFunctional ?? true,
        category,
        priority,
        status,
        projectId,
      },
    });
    res.status(201).json(requirement);
  } catch (err) {
    if (err.code === "P2003") {
      return res.status(404).json({ error: "Project not found" });
    }
    if (err.code === "P2002") {
      return res.status(409).json({ error: `A requirement with code '${code}' already exists in this project` });
    }
    res.status(500).json({ error: err.message });
  }
});

// ── PATCH /projects/:projectId/requirements/:id ──────────────────────────────
// Partially update a requirement
router.patch("/:id", async (req, res) => {
  const projectId = Number(req.params.projectId);
  const id = Number(req.params.id);
  const { code, description, isFunctional, category, priority, status } = req.body;

  try {
    const requirement = await prisma.requirement.update({
      where: {
        id,
        projectId, // ensures the requirement actually belongs to this project
      },
      data: {
        ...(code          !== undefined && { code }),
        ...(description   !== undefined && { description }),
        ...(isFunctional  !== undefined && { isFunctional }),
        ...(category      !== undefined && { category }),
        ...(priority      !== undefined && { priority }),
        ...(status        !== undefined && { status }),
      },
    });
    res.json(requirement);
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ error: "Requirement not found" });
    }
    if (err.code === "P2002") {
      return res.status(409).json({ error: `A requirement with code '${code}' already exists in this project` });
    }
    res.status(500).json({ error: err.message });
  }
});

// ── DELETE /projects/:projectId/requirements/:id ─────────────────────────────
// Delete a requirement
router.delete("/:id", async (req, res) => {
  const projectId = Number(req.params.projectId);
  const id = Number(req.params.id);

  try {
    await prisma.requirement.delete({
      where: {
        id,
        projectId,
      },
    });
    res.status(204).send();
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ error: "Requirement not found" });
    }
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;