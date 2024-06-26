import { Router } from "express";
import { authenticate } from "../middleware/authenticator";
import { User } from "@prisma/client";

import {
  getAllPublicChats,
  getChats,
  updateUser,
} from "../controllers/user.control";

const router = Router();

router.get("/:id/chats", authenticate, getChats);

router.put("/", authenticate, updateUser);

router.get("/public", authenticate, getAllPublicChats);

export default router;
