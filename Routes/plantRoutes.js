import express from "express";
import {
  getPlants,
  getPlantById,
  createPlant,
  updatePlant,
  deletePlant,
  getPlantsByCategory,
} from "../controllers/plantController.js";

const router = express.Router();

// Test route to verify router works
router.get("/test", (req, res) => {
  res.json({ success: true, message: "Plant routes working!" });
});

// Main routes
router.route("/")
  .get(getPlants)
  .post(createPlant);

// Category route
router.get("/category/:category", getPlantsByCategory);

// ID routes
router.route("/:id")
  .get(getPlantById)
  .put(updatePlant)
  .delete(deletePlant);

export default router;