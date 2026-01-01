import { Router } from "express";
import { InitializationController } from "../controllers/InitializationController";
const router = Router();
router.get("/initialize", new InitializationController().initialize);
export default router;