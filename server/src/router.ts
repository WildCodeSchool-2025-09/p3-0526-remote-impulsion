import express from "express";
import exerciseActions from "./modules/exercise/exerciseActions";

const router = express.Router();

/* ************************************************************************* */
router.get("/api/exercises/:id", exerciseActions.read);
/* ************************************************************************* */

/* ************************************************************************* */

export default router;
