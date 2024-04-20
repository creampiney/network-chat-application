import { Router } from "express";
import { authenticate } from "../middleware/authenticator";
import { User } from "@prisma/client";

import { getChats } from "../controllers/user.control";

const router = Router();

router.get("/:id/chats", authenticate, getChats);

export default router;
