import { Router } from "express";
import weddingRouter from "./wedding";
import tasksRouter from "./tasks";

const router = Router();

router.get("/healthz", (req, res) => {
  res.json({ status: "ok" });
});

router.use("/wedding", weddingRouter);
router.use("/tasks", tasksRouter);

export default router;
