import express from "express";
import {
  getReportes,
  getReporteById,
  createReporte,
  updateReporte,
  deleteReporte
} from "../controllers/reportesController.js";

const router = express.Router();

router.get("/", getReportes);
router.get("/:id", getReporteById);
router.post("/", createReporte);
router.put("/:id", updateReporte);
router.delete("/:id", deleteReporte);

export default router;
