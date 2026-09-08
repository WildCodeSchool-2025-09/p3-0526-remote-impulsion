import express from "express";

const router = express.Router();

router.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

import exerciseActions from "./modules/exercise/exerciseActions";

router.get("/api/exercises", exerciseActions.browse);
router.get("/api/exercises/:id", exerciseActions.read);

import workoutSessionActions from "./modules/workout-session/workoutSessionActions";

router.post("/api/workout-sessions", workoutSessionActions.add);
router.get("/api/workout-sessions", workoutSessionActions.browse);
router.delete("/api/workout-sessions/:id", workoutSessionActions.destroy);

export default router;
