import express from "express";

import exerciseActions from "./modules/exercise/exerciseActions";

const router = express.Router();

/* ************************************************************************* */
// Define Your API Routes Here
/* ************************************************************************* */

router.get("/api/exercises", exerciseActions.browse);
router.get("/api/exercises/:id", exerciseActions.read);

/* ************************************************************************* */

export default router;
