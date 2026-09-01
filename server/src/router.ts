import express from "express";

const router = express.Router();

/* ************************************************************************* */
// Define Your API Routes Here
/* ************************************************************************* */

router.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});
// Define exercise-related routes
import exerciseActions from "./modules/exercise/exerciseActions";

router.get("/api/exercises", exerciseActions.browse);
router.get("/api/exercises/:id", exerciseActions.read);

/* ************************************************************************* */

export default router;
