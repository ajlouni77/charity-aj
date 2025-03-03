const { ContactMessage } = require("../models");
const nodemailer = require("nodemailer");
require("dotenv").config();

const getAllMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.findAll();

    if (!messages.length) {
      return res.status(404).json({ message: "No contact messages found" });
    }

    return res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching contact messages:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const replyToMessage = async (req, res) => {
  const { email, replyMessage } = req.body;

  if (!email || !replyMessage) {
    return res
      .status(400)
      .json({ message: "Email and reply message are required" });
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Reply to Your Contact Message",
    text: replyMessage,
  };

  try {
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ message: "Reply sent successfully" });
  } catch (error) {
    console.error("Error sending reply:", error);
    return res.status(500).json({ message: "Error sending reply email" });
  }
};
const addMessages = async (req, res) => {
  try {
    const { name, email, description } = req.body;

    if (!name || !email || !description) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newMessage = await ContactMessage.create({ name, email, description });

    return res.status(201).json({ message: "Message added successfully", data: newMessage });
  } catch (error) {
    console.error("Error adding message:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
module.exports = {
  getAllMessages,
  replyToMessage,
  addMessages
};
