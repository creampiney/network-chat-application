import { Request, Response, Router } from "express";
import { z } from "zod";
import { db } from "../lib/db";
import { authenticate } from "../middleware/authenticator";
import { io, userSocket } from "..";

const createRoomBodySchema = z.object({
  participantAId: z.string(),
  participantBId: z.string(),
});

//===============================================================

//@desc     Get a chat
//@route    GET chats/:id
//@access   Private

export const getChat = async (req: Request, res: Response) => {
  const { id } = req.params;

  const user = req.body.user;

  if (id.length != 24 || /[0-9A-Fa-f]{24}/g.test(id) === false) {
    return res.status(404).send("No chat found");
  }

  try {
    // Check if chat is valid
    const chatRes = await db.privateChat.findUnique({
      where: {
        id: id,
      },
      include: {
        participantA: {
          select: {
            id: true,
            displayName: true,
            avatar: true,
          },
        },
        participantB: {
          select: {
            id: true,
            displayName: true,
            avatar: true,
          },
        },
        messages: {
          orderBy: {
            sentAt: "asc",
          },
        },
      },
    });

    if (!chatRes) {
      return res.status(404).send("No chat found");
    }

    if (
      chatRes.participantAId !== user.id &&
      chatRes.participantBId !== user.id
    ) {
      return res.status(403).send("You don't have access to this chat");
    }

    return res.send(chatRes);
  } catch (err) {
    return res.status(400).send(err);
  }
};

//@desc     Get a Public chat
//@route    GET chats/public/:id
//@access   Public

export const getPublicChatById = async (req: Request, res: Response) => {
  const { id } = req.params;

  const user = req.body.user;

  if (id.length != 24 || /[0-9A-Fa-f]{24}/g.test(id) === false) {
    return res.status(404).send("No chat found");
  }

  try {
    // Check if chat is valid
    const chatRes = await db.publicChat.findUnique({
      where: {
        id: id,
      },
      include: {
        participants: {
          select: {
            id: true,
            displayName: true,
            avatar: true,
          },
        },
        messages: {
          orderBy: {
            sentAt: "asc",
          },
          include: {
            sender: {
              select: {
                id: true,
                displayName: true,
                avatar: true
              }
            }
          }
        },
      },
    });
    console.log(chatRes);
    if (!chatRes) {
      return res.status(404).send("No chat found");
    }

    if (!chatRes.participantsId.includes(user.id)) {
      return res.status(403).send("You don't have access to this chat");
    }

    return res.send(chatRes);
  } catch (err) {
    return res.status(400).send(err);
  }
};

//@desc     Create a Public chat
//@route    POST chats/public/
//@access   Public

const createPublicRoomBodySchema = z.object({
  chatName: z.string(),
  chatAvatar: z.string().url(),
});

export const createPublicChat = async (req: Request, res: Response) => {
  const { user, ...body } = req.body;
  const parseStatus = createPublicRoomBodySchema.safeParse(body);
  if (!parseStatus.success) return res.status(400).send("Invalid Data");
  const parsedBody = parseStatus.data;

  try {
    // Check if participant Id is valid or not

    const chatRes = await db.publicChat.create({
      data: {
        participantsId: [user.id],
        chatName: parsedBody.chatName,
        chatAvatar: parsedBody.chatAvatar,
        participantsUnread: [0]
      },
    });

    const userRes = await db.user.update({
      where: {
        id: user.id,
      },
      data: {
        publicChatId: { push: chatRes.id },
      },
    });
    io.emit("global-updateData:public");
    return res.send(chatRes);
  } catch (err) {
    return res.status(400).send(err);
  }
};

//@desc     Create a chat
//@route    PUT chats/:id
//@access   Private

export const createChat = async (req: Request, res: Response) => {
  const body = req.body;

  const parseStatus = createRoomBodySchema.safeParse(body);
  if (!parseStatus.success) return res.status(400).send("Invalid Data");

  const parsedBody = parseStatus.data;

  try {
    // Check if participant Id is valid or not
    if (
      parsedBody.participantAId.length != 24 ||
      /[0-9A-Fa-f]{24}/g.test(parsedBody.participantAId) === false
    ) {
      return res.status(404).send("Participant A not found");
    }

    if (
      parsedBody.participantBId.length != 24 ||
      /[0-9A-Fa-f]{24}/g.test(parsedBody.participantBId) === false
    ) {
      return res.status(404).send("Participant B not found");
    }

    if (parsedBody.participantAId === parsedBody.participantBId) {
      return res
        .status(400)
        .send("You cannot make chat with both of participants are same user");
    }

    // If there is room already, send that room
    const findOldChatRoom = await db.privateChat.findFirst({
      where: {
        OR: [
          {
            participantAId: parsedBody.participantAId,
            participantBId: parsedBody.participantBId,
          },
          {
            participantAId: parsedBody.participantBId,
            participantBId: parsedBody.participantAId,
          },
        ],
      },
    });

    if (findOldChatRoom) {
      return res.send(findOldChatRoom);
    }

    const chatRes = await db.privateChat.create({
      data: {
        participantAId: parsedBody.participantAId,
        participantBId: parsedBody.participantBId,
      },
    });

    io.emit(`users:${parsedBody.participantAId}:chatsUpdate`);
    io.emit(`users:${parsedBody.participantBId}:chatsUpdate`);

    return res.send(chatRes);
  } catch (err) {
    return res.status(400).send(err);
  }
};

//@desc     Join a Public chat
//@route    GET chats/public/id/join
//@access   Public

export const joinChat = async (req: Request, res: Response) => {
  const { user } = req.body;
  const { id } = req.params;

  try {
    // Check if participant Id is valid or not

    // If there is room already, send that room
    const findOldChatRoom = await db.publicChat.findUnique({
      where: { id: id },
    });
    if (!findOldChatRoom) {
      return res.status(404).send("Cannot Join : Not found chat room");
    }

    if (findOldChatRoom.participantsId.includes(user.id)) {
      io.to(id).emit("public-chat:message", "why join same room?");
      return res.send(findOldChatRoom);
    }

    const chatRes = await db.publicChat.update({
      where: {
        id: id,
      },
      data: {
        participantsId: [...findOldChatRoom.participantsId, user.id],
        participantsUnread: {
          push: 0
        }
      },
    });

    const userRes = await db.user.update({
      where: { id: user.id },
      data: { publicChatId: { push: id } },
    });
    const senderSocket: string[] = [];
    userSocket.forEach((value, key) => {
      if (value.userId === user.id) {
        senderSocket.push(key);
      }
    });

    if (senderSocket.length !== 0) {
      io.to(senderSocket).emit("global-updateData:public");
    }

    io.to(id).emit("public-chat:message", "some one join your room ");
    io.emit(`public-chat:${id}:newParticipant`)
    /*
    io.emit(`users:${parsedBody.participantAId}:chatsUpdate`);
    io.emit(`users:${parsedBody.participantBId}:chatsUpdate`);
    */
    return res.send(chatRes);
  } catch (err) {
    return res.status(400).send(err);
  }
};

//@desc     Update a chat
//@route    PUT chats/:id/read
//@access   Private

export const updateChat = async (req: Request, res: Response) => {
  const { id } = req.params;

  const user = req.body.user;
  const userId: string = user.id;

  try {
    // Check if chat id is valid
    if (id.length != 24 || /[0-9A-Fa-f]{24}/g.test(id) === false) {
      return res.status(404).send("Chat not found");
    }

    // Check if user have priority to read
    const roomRes = await db.privateChat.findUnique({
      where: {
        id: id,
        OR: [
          {
            participantAId: userId,
          },
          {
            participantBId: userId,
          },
        ],
      },
    });

    if (!roomRes) {
      return res
        .status(403)
        .send("You don't have priority to update this chat");
    }

    if (roomRes.participantAId === userId) {
      // Update A
      const updateRes = await db.privateChat.update({
        where: {
          id: id,
        },
        data: {
          participantAUnread: 0,
        },
      });

      io.emit(`users:${userId}:chatsUpdate`);

      return res.send(updateRes);
    } else {
      // Update B
      const updateRes = await db.privateChat.update({
        where: {
          id: id,
        },
        data: {
          participantBUnread: 0,
        },
      });

      io.emit(`users:${userId}:chatsUpdate`);

      return res.send(updateRes);
    }
  } catch (err) {
    return res.status(403).send(err);
  }
};
