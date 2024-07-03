const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const multer = require("multer");
const bodyParser = require("body-parser");
require("dotenv").config();
const app = express();
const port = 3000;

// Configure multer for file uploads
const upload = multer();

// Middleware
app.use(cors());
app.use(bodyParser.json());

function sendEmail({
  userId,
  password,
  recipients,
  subject,
  message,
  attachments,
}) {
  // Configure nodemailer
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: userId,
      pass: password,
    },
  });

  return new Promise((resolve, reject) => {
    const mailConfigs = {
      from: userId,
      to: recipients,
      subject: subject,
      html: `<p>${message.replace(/\n/g, "<br>")}</p>`,
      attachments: attachments.map((attachment) => ({
        filename: attachment.originalname,
        content: attachment.buffer,
        contentType: attachment.mimetype,
      })),
    };

    transporter.sendMail(mailConfigs, (error, info) => {
      if (error) {
        console.error(error);
        return reject({ message: `An error has occurred: ${error.message}` });
      }
      return resolve({ message: "Email sent successfully" });
    });
  });
}

// Endpoint to handle email sending
app.post("/", upload.array("attachments"), (req, res) => {
  try {
    const { userId, password, recipients, subject, body } = req.body;
    const attachments = req.files;

    if (!userId || !password || !recipients || !subject || !body || !attachments) {
      return res.status(400).send("Missing required fields");
    }

    // Parse recipients from JSON string
    const parsedRecipients = JSON.parse(recipients);

    sendEmail({ userId, password, recipients: parsedRecipients, subject, message: body, attachments })
      .then((response) => res.send(response.message))
      .catch((error) => res.status(500).send(error.message));
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
