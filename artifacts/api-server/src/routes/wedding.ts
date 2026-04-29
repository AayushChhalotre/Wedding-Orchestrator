import { Router } from "express";
import { db, weddingsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

// In a real app, we'd get the weddingId from the session/user
// For now, we'll use a hardcoded ID or the first one found
const DEFAULT_WEDDING_ID = "wedding-1";

router.get("/", async (req, res) => {
  try {
    const wedding = await db.query.weddingsTable.findFirst({
      where: eq(weddingsTable.id, DEFAULT_WEDDING_ID),
    });
    
    if (!wedding) {
      return res.status(404).json({ message: "Wedding not found" });
    }
    
    return res.json(wedding);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.patch("/", async (req, res) => {
  try {
    const updated = await db
      .update(weddingsTable)
      .set(req.body)
      .where(eq(weddingsTable.id, DEFAULT_WEDDING_ID))
      .returning();
      
    return res.json(updated[0]);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
