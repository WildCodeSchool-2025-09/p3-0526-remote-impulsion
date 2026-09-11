import express from "express";

import exerciseActions from "./modules/exercise/exerciseActions";

import filtersActions from "./modules/filters/filtersActions";

const router = express.Router();

/* ************************************************************************* */
// Define Your API Routes Here
/* ************************************************************************* */

router.get("/api/exercises", exerciseActions.browse);

router.get("/api/categories", filtersActions.browseCategories);
router.get("/api/difficulties", filtersActions.browseDifficulties);
router.get("/api/equipment", filtersActions.browseEquipment);

/* ************************************************************************* */

export default router;
