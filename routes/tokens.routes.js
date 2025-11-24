import express from "express";
import {
  getTokens,
  getTokenById,
  createToken,
  updateToken,
  deleteToken
} from "../controllers/tokens.controller.js";

const router = express.Router();

router.get("/", getTokens);
router.get("/:id", getTokenById);
router.post("/", createToken);
router.put("/logout/:id_usuario", logoutToken);
router.put("/:id", updateToken);
router.delete("/:id", deleteToken);

export default router;
