import { Router } from "express";
import { db, tasksTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

const router = Router();
const DEFAULT_WEDDING_ID = "wedding-1";

router.get("/", async (req, res) => {
  try {
    const tasks = await db.query.tasksTable.findMany({
      where: eq(tasksTable.id, DEFAULT_WEDDING_ID),
    });
    return res.json(tasks);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const newTask = {
      ...req.body,
      id: uuidv4(),
      weddingId: DEFAULT_WEDDING_ID,
    };
    const created = await db.insert(tasksTable).values(newTask).returning();
    return res.status(201).json(created[0]);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.patch("/:taskId", async (req, res) => {
  try {
    const updated = await db
      .update(tasksTable)
      .set(req.body)
      .where(eq(tasksTable.id, req.params.taskId))
      .returning();
    return res.json(updated[0]);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.delete("/:taskId", async (req, res) => {
  try {
    await db.delete(tasksTable).where(eq(tasksTable.id, req.params.taskId));
    return res.status(204).end();
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
