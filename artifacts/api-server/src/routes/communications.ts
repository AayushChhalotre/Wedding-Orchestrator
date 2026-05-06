import { Router } from "express";
import { v4 as uuidv4 } from "uuid";

const router = Router();

router.post("/notify", async (req, res) => {
  const { stakeholderId, type, message, taskId } = req.body;

  if (!stakeholderId || !type || !message) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 800));

  console.log(`[COMMUNICATION SERVICE] Sending ${type} to stakeholder ${stakeholderId}: "${message}"`);

  return res.status(200).json({
    success: true,
    deliveryId: `del-${uuidv4().substring(0, 8)}`,
    timestamp: new Date().toISOString(),
    status: "sent"
  });
});

export default router;
