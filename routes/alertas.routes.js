import express from "express";
import {
  getAlertas,
  getAlertaById,
  createAlerta,
  updateAlerta,
  deleteAlerta
} from "../controllers/alertasController.js";

const router = express.Router();

// Obtener todas las alertas
router.get("/", getAlertas);

// Obtener una alerta por ID
router.get("/:id", getAlertaById);

// Crear una nueva alerta
router.post("/", createAlerta);

// Actualizar una alerta existente
router.put("/:id", updateAlerta);

// Eliminar una alerta
router.delete("/:id", deleteAlerta);

export default router;
