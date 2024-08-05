import express from "express";

const messagesRouter  = express.Router();

messagesRouter.get("/", (req, res) => {
    return res.send("Here are your messages: ");
});

messagesRouter.post("/", (req, res) => {
    return res.send(req.body);
});

export default messagesRouter;