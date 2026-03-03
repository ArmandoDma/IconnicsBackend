import express from "express";
import {
  getSensores,
  getSensorById,
  createSensor,
  updateSensor,
  deleteSensor
} from "../controllers/sensores.controller.js";

const router = express.Router();

router.get("/", getSensores);
router.get("/:id", getSensorById);
router.post("/", createSensor);
router.put("/:id", updateSensor);
router.delete("/:id", deleteSensor);

export default router;
