import express from "express";

import exerciseActions from "./modules/exercise/exerciseActions";
import workoutSessionActions from "./modules/workout-session/workoutSessionActions";

const router = express.Router();

router.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

router.get("/api/exercises", exerciseActions.browse);

router.post("/api/workout-sessions", workoutSessionActions.add);
router.get("/api/workout-sessions", workoutSessionActions.browse);
router.get("/api/workout-sessions/:id", workoutSessionActions.read);
router.delete("/api/workout-sessions/:id", workoutSessionActions.destroy);

export default router;
