import express from "express";
import {promises as fs} from 'fs';
import {IMessage} from "../types";


const messagesRouter = express.Router();

messagesRouter.get("/", (req, res) => {
    let data: IMessage[] = [];

    return res.send("Here are your messages: ");
});

messagesRouter.post("/", async (req, res) => {
    const datetime = new Date().toISOString();
    const fileName = `${datetime}.txt`;

    const newMessage: IMessage = {
        message: req.body.message,
        datetime,
    };

    await fs.writeFile(`./messages/${fileName}`, JSON.stringify(newMessage));
    return res.send(newMessage);
});

export default messagesRouter;