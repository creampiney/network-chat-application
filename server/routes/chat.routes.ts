import { Router } from "express";
import { z } from "zod";
import { db } from "../lib/db";
import { authenticate } from "../middleware/authenticator";
import { io } from "..";

const router = Router();

import { getChat, createChat, updateChat } from "../controllers/chat.control";

router.get("/:id", authenticate, getChat);

router.post("/", authenticate, createChat);

router.put("/:id/read", authenticate, updateChat);

export default router;
