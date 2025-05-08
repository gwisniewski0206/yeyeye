import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  // Handle CORS preflight requests
  res.setHeader("Access-Control-Allow-Origin", "https://preeminent-cucurucho-92fbe3.netlify.app");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
  // If you later add cookies/auth:
  // res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    // Preflight
    return res.status(200).end();
  }
  // Set CORS header for actual request
  res.setHeader('Access-Control-Allow-Origin', "https://preeminent-cucurucho-92fbe3.netlify.app");

  try {
    const { name, email, message } = req.body;
    console.log("json parsed");

    // Configure transporter
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    console.log("transporter configured");

    // Send mail
    await transporter.sendMail({
      from: `"Contact Form" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO,
      subject: `YOOOOOO ${name}`,
      text: `Name: ${name}
Email: ${email}
Message: ${message}`,
    });

    console.log("mail sent");
    
    return res.status(200).json({ message: 'Email sent successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
