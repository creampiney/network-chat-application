import { Router } from "express";
import { getUser, login, register, logout } from "../controllers/auth.control";
import { authenticate } from "../middleware/authenticator";

const router = Router();

router.post("/register", register);

router.post("/login", login);

router.get("/user", authenticate, getUser);

router.post("/logout", authenticate, logout);

export default router;
