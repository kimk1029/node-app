import { Router } from "express";
import * as userController from "./controllers/userController";
import * as bbsController from "./controllers/bbsController";

const router = Router();

router.get("/", userController.index);
router.get("/test", userController.test);
router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/bbs", bbsController.getBbs);
router.get("/bbs/:id", bbsController.getBbsById);

export default router;
