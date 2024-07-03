const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const multer = require('multer');
const bodyParser = require('body-parser');
require('dotenv').config();
const app = express();
const port = 5001;

// Configure multer for file uploads
const upload = multer();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Configure nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USERNAME,
    pass: process.env.GMAIL_PASSWORD,
  },
});

function sendEmail({ recipients, subject, message, attachments }) {
  return new Promise((resolve, reject) => {
    const mailConfigs = {
      from: process.env.GMAIL_USERNAME,
      to: recipients,
      subject: subject,
      html: `<p>${message.replace(/\n/g, '<br>')}</p>`,
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
      return resolve({ message: 'Email sent successfully' });
    });
  });
}

app.post('/', upload.array('attachments'), (req, res) => {
  try {
    const { recipients, subject, body: message } = req.body;
    const attachments = req.files;

    // Parse recipients from JSON string
    const parsedRecipients = JSON.parse(recipients);

    sendEmail({ recipients: parsedRecipients, subject, message, attachments })
      .then((response) => res.send(response.message))
      .catch((error) => res.status(500).send(error.message));
  } catch (error) {
    console.error(error);
    res.status(400).send('Invalid request');
  }
});

app.listen(port, () => {
  console.log(`nodemailerProject is listening at http://localhost:${port}`);
});
