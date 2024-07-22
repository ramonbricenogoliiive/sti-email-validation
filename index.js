const express = require('express');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const cors = require('cors')

dotenv.config(); // Load environment variables

const app = express();
const port = process.env.PORT || 3000; // Use port from environment or default to 3000

const bodyParser = require('body-parser');
// Middleware
app.use(bodyParser.json()); // Parse JSON data in request body
app.use(bodyParser.urlencoded({ extended: true })); // Parse form data
app.use(cors({
  origin: '*',
}))

// Configure email transporter
const transporter = nodemailer.createTransport({
  tls: { rejectUnauthorized: false },
  service: 'gmail', // Replace with your email service (e.g., 'hotmail', 'yahoo')
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

app.get('/', (req, res) => {
    res.send('Hello World!');
})

// Endpoint to send email
app.post('/send-email/', async (req, res) => {
  try {
    const { lead, subject, message } = req.body; // Get data from request body
    console.log(lead, subject, message);
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'ramon@stroudinc.com',
      subject: subject,
      text: `${message} Email: ${lead}` // Change to 'html' for HTML content
    };

    const info = await transporter.sendMail(mailOptions);

    res.json({ message: 'Email sent successfully!', info });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error sending email!' });
  }
});

app.listen(port, () => console.log(`Server listening on port ${port}`));