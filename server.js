const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { Resend } = require('resend');

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files from /public if present
const publicDir = path.join(__dirname, 'public');
if (fs.existsSync(publicDir)) {
  app.use(express.static(publicDir));
  console.log('Serving static files from /public');
} else {
  console.log('No /public folder found; static files will not be served.');
}

// Lazy/init Resend only if key present
let resend = null;
if (process.env.RESEND_API_KEY) {
  try {
    resend = new Resend(process.env.RESEND_API_KEY);
    console.log('Resend initialized');
  } catch (err) {
    console.error('Failed to initialize Resend:', err);
    resend = null;
  }
} else {
  console.warn('RESEND_API_KEY not set. /api/send-gift will return error until set.');
}

// نقطة إرسال الإهداء
app.post('/api/send-gift', async (req, res) => {
  try {
    const { orderId, sender, receiver, phone, message } = req.body;

    if (!orderId || !sender || !receiver || !phone || !message) {
      return res.status(400).json({ success: false, error: 'حقول ناقصة' });
    }

    if (!resend) {
      return res.status(500).json({
        success: false,
        error: 'Email service not configured. RESEND_API_KEY missing or invalid.'
      });
    }

    const result = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'nuqtaksa8@gmail.com',
      subject: `طلب إهداء #${orderId} من ${sender}`,
      html: `<p>طلب جديد:</p><p>${message}</p>`
    });

    res.json({ success: true, id: result.id });
  } catch (error) {
    console.error('Send Gift Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Root route: serve index.html if present, otherwise json status
app.get('/', (req, res) => {
  const indexPath = path.join(publicDir, 'index.html');
  if (fs.existsSync(indexPath)) {
    return res.sendFile(indexPath);
  }
  res.json({ status: 'Server is running ✅' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
