require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 5001;

// Allow CORS from localhost (React dev) and same origin in production
const allowedOrigins = [
  'http://localhost:3000',
  // add your production domain if needed
];
app.use(cors({ origin: allowedOrigins, credentials: true }));

// Parse incoming JSON
app.use(express.json());

// Create reusable transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// POST /api/contact
// POST /api/contact
app.post('/api/contact', async (req, res) => {
    try {
      const { name, email, message } = req.body;
  
      // Compose email
      const mailOptions = {
        from: `"Contact Form" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_TO,
        subject: `New contact from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
      };
  
      // Send mail
      await transporter.sendMail(mailOptions);
      return res.status(200).json({ message: 'Email sent successfully' });
    } catch (err) {
      console.error('Error sending email:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });
  

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});