import express from "express";
import {
  getRecomendaciones,
  getRecomendacionById,
  createRecomendacion,
  updateRecomendacion,
  deleteRecomendacion
} from "../controllers/recomendaciones.controller.js";

const router = express.Router();

router.get("/", getRecomendaciones);
router.get("/:id", getRecomendacionById);
router.post("/", createRecomendacion);
router.put("/:id", updateRecomendacion);
router.delete("/:id", deleteRecomendacion);

export default router;
