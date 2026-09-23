import express from "express";
import authActions from "./modules/auth/authActions";
import exerciseActions from "./modules/exercise/exerciseActions";
import filtersActions from "./modules/filters/filtersActions";
import workoutSessionActions from "./modules/workout-session/workoutSessionActions";

const router = express.Router();

router.get("/api/exercises", exerciseActions.browse);
router.get("/api/exercises/:id", exerciseActions.read);

router.post("/api/workout-sessions", workoutSessionActions.add);
router.post(
  "/api/workout-sessions/:id/exercises",
  workoutSessionActions.addExercises,
);
router.get("/api/workout-sessions", workoutSessionActions.browse);
router.get("/api/workout-sessions/current", workoutSessionActions.readCurrent);
router.get("/api/workout-sessions/:id", workoutSessionActions.read);
router.patch("/api/workout-sessions/:id/start", workoutSessionActions.start);
router.patch(
  "/api/workout-sessions/:id/abandon",
  workoutSessionActions.abandon,
);
router.delete("/api/workout-sessions/:id", workoutSessionActions.destroy);

router.get("/api/categories", filtersActions.browseCategories);
router.get("/api/difficulties", filtersActions.browseDifficulties);
router.get("/api/equipment", filtersActions.browseEquipment);

router.post("/api/auth/register", authActions.register);

export default router;
