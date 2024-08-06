import express from "express";
import {promises as fs} from 'fs';
import path from 'path';
import {IMessage} from "../types";

const messagesRouter = express.Router();

const messagesPath = './messages';

const createIfNotExists = async (dirPath: string) => {
    try {
        await fs.mkdir(dirPath, {recursive: true});
    } catch (error) {
        console.error('Failed to create directory ', error);
    }
};

const getFiles = async (fileList: string[]) => {
    const data: IMessage[] = [];
    for (const fileName of fileList) {
        const filePath = path.join(messagesPath, fileName);

        try {
            const fileContent = await fs.readFile(filePath);
            const dataItem = JSON.parse(fileContent.toString());
            data.push(dataItem);
        } catch (error) {
            console.error('Failed to read file ', error);
        }
    }
    return data.slice(-5);
};

messagesRouter.get("/", async (req, res) => {
    try {
        await createIfNotExists(messagesPath);

        const fileList = await fs.readdir(messagesPath);
        const data = await getFiles(fileList)

        return res.send(data);
    } catch (error) {
        console.log('Error reading ', error);
    }
});

messagesRouter.post("/", async (req, res) => {
    const datetime = new Date().toISOString();
    const fileName = `${datetime}.txt`;

    const newMessage: IMessage = {
        message: req.body.message,
        datetime,
    };
    try {
        await createIfNotExists(messagesPath);
        await fs.writeFile(path.join(messagesPath, fileName), JSON.stringify(newMessage));
        return res.send(newMessage);
    } catch (error) {
        console.error('Failed to write message', error);
    }
    return res.send(newMessage);
});

export default messagesRouter;