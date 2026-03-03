import express from "express";
import {
  getMediciones,
  getMedicionById,
  createMedicion,
  updateMedicion,
  deleteMedicion
} from "../controllers/mediciones.controller.js";

const router = express.Router();

router.get("/", getMediciones);
router.get("/:id", getMedicionById);
router.post("/", createMedicion);
router.put("/:id", updateMedicion);
router.delete("/:id", deleteMedicion);

export default router;
