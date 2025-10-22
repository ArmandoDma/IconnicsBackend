import express from "express";
import {
  getSesiones,
  getSesionById,
  createSesion,
  updateSesion,
  deleteSesion
} from "../controllers/sesionesController.js";

const router = express.Router();

router.get("/", getSesiones);
router.get("/:id", getSesionById);
router.post("/", createSesion);
router.put("/:id", updateSesion);
router.delete("/:id", deleteSesion);

export default router;
