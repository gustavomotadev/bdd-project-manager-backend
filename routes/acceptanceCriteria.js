const express = require("express");
const { PrismaClient } = require("@prisma/client");

const router = express.Router({ mergeParams: true });
const prisma = new PrismaClient();

// ── GET /projects/:projectId/user-stories/:userStoryId/acceptance-criteria ───
// List all acceptance criteria for a user story
router.get("/", async (req, res) => {
  const userStoryId = Number(req.params.userStoryId);

  try {
    const criteria = await prisma.acceptanceCriterion.findMany({
      where: { userStoryId },
      orderBy: { createdAt: "asc" },
    });
    res.json(criteria);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── GET /projects/:projectId/user-stories/:userStoryId/acceptance-criteria/:id
// Get a single acceptance criterion by ID
router.get("/:id", async (req, res) => {
  const userStoryId = Number(req.params.userStoryId);
  const id = Number(req.params.id);

  try {
    const criterion = await prisma.acceptanceCriterion.findFirst({
      where: { id, userStoryId },
    });
    if (!criterion) return res.status(404).json({ error: "Acceptance criterion not found" });
    res.json(criterion);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── POST /projects/:projectId/user-stories/:userStoryId/acceptance-criteria ──
// Create a new acceptance criterion under a user story
router.post("/", async (req, res) => {
  const userStoryId = Number(req.params.userStoryId);
  const { title, given, when, then } = req.body;

  if (!title || !given || !when || !then) {
    return res.status(400).json({
      error: "Fields 'title', 'given', 'when', and 'then' are required",
    });
  }

  try {
    const criterion = await prisma.acceptanceCriterion.create({
      data: { title, given, when, then, userStoryId },
    });
    res.status(201).json(criterion);
  } catch (err) {
    if (err.code === "P2003") {
      return res.status(404).json({ error: "User story not found" });
    }
    res.status(500).json({ error: err.message });
  }
});

// ── PATCH /projects/:projectId/user-stories/:userStoryId/acceptance-criteria/:id
// Partially update an acceptance criterion
router.patch("/:id", async (req, res) => {
  const userStoryId = Number(req.params.userStoryId);
  const id = Number(req.params.id);
  const { title, given, when, then } = req.body;

  try {
    const criterion = await prisma.acceptanceCriterion.update({
      where: { id, userStoryId },
      data: {
        ...(title !== undefined && { title }),
        ...(given !== undefined && { given }),
        ...(when  !== undefined && { when }),
        ...(then  !== undefined && { then }),
      },
    });
    res.json(criterion);
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ error: "Acceptance criterion not found" });
    }
    res.status(500).json({ error: err.message });
  }
});

// ── DELETE /projects/:projectId/user-stories/:userStoryId/acceptance-criteria/:id
// Delete an acceptance criterion
router.delete("/:id", async (req, res) => {
  const userStoryId = Number(req.params.userStoryId);
  const id = Number(req.params.id);

  try {
    await prisma.acceptanceCriterion.delete({
      where: { id, userStoryId },
    });
    res.status(204).send();
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ error: "Acceptance criterion not found" });
    }
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;