import express from "express";
import {
  getUsuarios,
  getUsuarioById,
  createUsuario,
  updateUsuario,
  deleteUsuario
} from "../controllers/usuariosController.js";

const router = express.Router();

// Obtener todos los usuarios
router.get("/", getUsuarios);

// Obtener un usuario por ID
router.get("/:id", getUsuarioById);

// Crear un nuevo usuario
router.post("/", createUsuario);

// Actualizar un usuario existente
router.put("/:id", updateUsuario);

// Eliminar un usuario
router.delete("/:id", deleteUsuario);

export default router;
