import express from "express";
import {promises as fs} from 'fs';
import {IMessage} from "../types";

const path = './messages';

const messagesRouter = express.Router();

const getFiles = async (fileList: string[]) => {
    const data: IMessage[] = [];
    for (const fileName of fileList) {
        if (fileName === '.gitignore') continue;

        const filePath = `${path}/${fileName}`;
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
        const fileList = await fs.readdir(path);
        const data = await getFiles(fileList)

        return res.send(data);
    } catch (error) {
        console.log('Error reading ',error);
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
        await fs.writeFile(`${path}/${fileName}`, JSON.stringify(newMessage));
    } catch (error) {
        console.error('Failed to write message', error);
    }
    return res.send(newMessage);
});

export default messagesRouter;