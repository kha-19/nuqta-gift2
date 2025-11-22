const express = require('express');
const cors = require('cors');
const { Resend } = require('resend');

const app = express();
app.use(cors());
app.use(express.json());

const resend = new Resend(process.env.RESEND_API_KEY);

// نقطة إرسال الإهداء
app.post('/api/send-gift', async (req, res) => {
  try {
    const { orderId, sender, receiver, phone, message } = req.body;

    if (!orderId || !sender || !receiver || !phone || !message) {
      return res.status(400).json({ success: false, error: 'حقول ناقصة' });
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

app.get('/', (_, res) => {
  res.json({ status: 'Server is running ✅' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
