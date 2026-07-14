const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === 'true',
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

const sendOrderConfirmation = async (order, email) => {
  if (!email) return;
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: 'Order Confirmed — Semma Style Co',
      html: `<h2>Thank you for your order!</h2><p>Order #${order.id}</p><p>Total: ₹${order.total}</p>`,
    });
  } catch (e) {
    console.error('Email failed:', e.message);
  }
};

module.exports = { sendOrderConfirmation };
