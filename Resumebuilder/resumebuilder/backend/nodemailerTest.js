const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config(); // Ensure your .env file is loaded

const transporter = nodemailer.createTransport({
  service: 'gmail', // or another email service like Outlook, Yahoo, etc.
  auth: {
    user: process.env.EMAIL_USER, // Your email from .env
    pass: process.env.EMAIL_PASS, // Your email password or app password from .env
  },
});

const mailOptions = {
  from: process.env.EMAIL_USER, // Sender address
  to: 'rdanthul@gitam.in', // Replace with your email
  subject: 'Nodemailer Test Email',
  text: 'This is a test email from Nodemailer setup.', // Email content
};

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Email sent:', info.response);
  }
});
