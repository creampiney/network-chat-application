import express, { Express, Request, Response } from "express";
import { z } from "zod";
import generateStatusResponse from "../lib/statusResponseGenerator";
import { db } from "../lib/db";
import bcrypt from "bcrypt";
import { generateJWT } from "../lib/jwtGenerator";
import { User } from "@prisma/client";



const max_age = 5 * 24 * 60 * 60;

const registerUserSchema = z.object({
    username: z
        .string()
        .trim()
        .min(1, { message: "Please fill username" })
        .max(32, { message: "Username should not exceed 32 characters" }),
    password: z
        .string()
        .trim()
        .min(8, { message: "Password should have more than 8 characters" }),
    displayName: z
        .string()
        .trim()
        .min(1, { message: "Please fill display name" })
        .max(32, { message: "Display name should not exceed 32 characters"}),
    avatar: z
        .string()
        .trim()
        .url()
})

export const login = async (req: Request, res: Response) => {
    const { username, password } = req.body;

    const user = await db.user.findUnique({
        where: {
          username: username,
        },
    });

    if (!user) {
        return res.status(400).send(generateStatusResponse(400, "Username or password is wrong"));
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).send(generateStatusResponse(400, "Username or password is wrong"));
    }

    const token = generateJWT(user.id, user.username);
    res.cookie("auth", token, { httpOnly: true, maxAge: max_age * 1000 });

    return res.status(200).send({
        ...user,
        token: token,
    });
}

export const register = async (req: Request, res: Response) => {
    const data = req.body;

    const parseStatus = registerUserSchema.safeParse(data);
    if (!parseStatus.success) {
        return res.status(400).send(generateStatusResponse(400, parseStatus.error.message));
    }

    const parsedBody = parseStatus.data

    // Check if username already used
    const findUser = await db.user.findUnique({
        where: {
            username: parsedBody.username
        }
    })

    if (findUser) {
        return res.status(400).send(generateStatusResponse(400, "This username is already used"));
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(parsedBody.password, salt);

    try {

        const result = await db.user.create({
            data: {
                username: parsedBody.username,
                password: hashedPassword,
                displayName: parsedBody.displayName,
                avatar: parsedBody.avatar
            }
        })

        const token = generateJWT(result.id, parsedBody.username);

        res.cookie("auth", token, { httpOnly: true, maxAge: max_age * 1000 });

        return res.status(201).send({
            ...result,
            token: token
        })


    } catch (err) {
        console.log(err)
        return res.status(400).send(generateStatusResponse(400, err))
    }
}

export const getUser = async (req: Request, res: Response) => {
    const user: User = req.body.user;
    
    const query = await db.user.findUnique({
      where: {
        id: user.id as string,
      },
    });
    if (!query) {
      return res.status(400).clearCookie("auth").send(generateStatusResponse(400, "Not Found"));
    }

    const { password, ...data } = query;

    res.status(200).send(data);

}