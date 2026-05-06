import { Router } from "express";
import weddingRouter from "./wedding";
import tasksRouter from "./tasks";
import communicationsRouter from "./communications";
import vendorRouter from "./vendor";

const router = Router();

router.get("/healthz", (req, res) => {
  res.json({ status: "ok" });
});

router.use("/wedding", weddingRouter);
router.use("/tasks", tasksRouter);
router.use("/communications", communicationsRouter);
router.use("/vendor", vendorRouter);

export default router;
