import express, { Express, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes";
import chatRouter from "./routes/chat.routes";
import userRouter from "./routes/user.routes";
import { Server } from "socket.io";
import { createServer } from "http";
import { db } from "./lib/db";
import { Message, User } from "@prisma/client";
dotenv.config();

const app: Express = express();

const port = process.env.PORT || 3001;

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

app.use(cookieParser());
app.use(cors({ credentials: true, origin: "http://localhost:5173" }));
app.use(express.json());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/chats", chatRouter);
app.use("/api/v1/users", userRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World");
});

let CountUser = 0;

type UserObject = {
  userId: string;
  displayName: string;
  avatar: string;
};

let userSocket: Map<String, UserObject> = new Map();

io.on("connection", (socket) => {
  socket.on("join-global-chat", ({ userId, displayName, avatar }) => {
    userSocket.set(socket.id, {
      userId: userId,
      displayName: displayName,
      avatar: avatar,
    });
    io.emit("global-chat", {
      userMap: [...userSocket.values()],
    });
    console.log(`user in system is ${userSocket.size}`);
  });

  socket.on("disconnect", () => {
    userSocket.delete(socket.id);
    socket.broadcast.emit("global-chat", {
      userMap: [...userSocket.values()],
    });
    console.log(`user in system is ${userSocket.size}`);
  });

  socket.on(
    "chats:sendMessage",
    async (message: Message, senderSide: "A" | "B", sendTo: string) => {
      console.log(message);
      try {
        const createMessage = await db.message.create({
          data: message,
        });

        let updateData: any = {
          lastUpdated: message.sentAt,
        };

        if (senderSide === "A") {
          updateData = {
            ...updateData,
            participantBUnread: {
              increment: 1,
            },
          };
        } else {
          updateData = {
            ...updateData,
            participantAUnread: {
              increment: 1,
            },
          };
        }

        const updateChat = await db.privateChat.update({
          where: {
            id: message.chatPrivateId,
          },
          data: updateData,
        });

        const senderUser = await db.user.findUnique({
          where: {
            id: sendTo,
          },
          select: {
            id: true,
            displayName: true,
            avatar: true,
          },
        });

        if (!senderUser) return;

        io.emit(`chats:${message.chatPrivateId}:addMessage`, message);

        io.emit(`users:${message.senderId}:chatsUpdate`);
        io.emit(`users:${sendTo}:chatsUpdate`);

        io.emit(`users:${sendTo}:notifications`, {
          type: "Chat",
          context: message.chatPrivateId,
          title: `Chat from ${senderUser.displayName} | HorHub`,
          message:
            message.type === "Text"
              ? message.text
              : message.type === "Images"
              ? `${message.pictures.length} picture(s) ${
                  message.pictures.length > 1 ? "are" : "is"
                } sent`
              : "The location is sent",
          icon: senderUser.avatar,
        });
      } catch (err) {
        console.log(err);
      }
    }
  );
});

server.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

export { io };
