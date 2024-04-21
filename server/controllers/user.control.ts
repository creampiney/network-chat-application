import { Request, Response } from "express";
import { db } from "../lib/db";
import { z } from "zod";
import { io, userSocket } from "..";
//=========================================================

//@desc     Get All Chats
//@route    GET /users/:id/chats
//@access   Private
export const getChats = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (id.length != 24 || /[0-9A-Fa-f]{24}/g.test(id) === false) {
    return res.status(404).send("No user found");
  }

  try {
    const chatsRes = await db.privateChat.findMany({
      where: {
        OR: [
          {
            participantAId: id,
          },
          {
            participantBId: id,
          },
        ],
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
            sentAt: "desc",
          },
          take: 1,
        },
      },
      orderBy: {
        lastUpdated: "desc",
      },
    });

    const result = chatsRes.map((chat) => {
      if (chat.messages.length === 0) {
        const result: any = { ...chat };
        delete result.messages;
        return result;
      } else {
        const result: any = { ...chat, latestMessage: chat.messages[0] };
        delete result.messages;
        return result;
      }
    });

    return res.send(result);

    // return res.send(chatsRes)
  } catch (err) {
    return res.status(400).send(err);
  }
};

const UserSchema = z.object({
  displayName: z.string().min(1),
});

export const updateUser = async (req: Request, res: Response) => {
  const { user, ...data } = req.body;
  try {
    const data_parse = UserSchema.safeParse(data);
    if (data_parse.success) {
      const true_data = data_parse.data;
      const result = await db.user.update({
        where: { id: user.id },
        data: true_data,
      });
      io.sockets.to([...userSocket.keys()]).emit("updateData");
      console.log(result);
      return res.send("Success");
    } else {
      return res.status(403).send("Wrong formatted");
    }
  } catch (err) {
    console.log(err);
    return res.send(403).send("Forbidden");
  }
};
