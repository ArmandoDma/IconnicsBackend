import express from "express";
import {
  getProtocolos,
  getProtocoloById,
  createProtocolo,
  updateProtocolo,
  deleteProtocolo
} from "../controllers/protocolosController.js";

const router = express.Router();

router.get("/", getProtocolos);
router.get("/:id", getProtocoloById);
router.post("/", createProtocolo);
router.put("/:id", updateProtocolo);
router.delete("/:id", deleteProtocolo);

export default router;
