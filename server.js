const express = require('express');
const cors = require('cors');
const { Resend } = require('resend');

// استيراد راوتر الشات
const chatRoutes = require('./chat/chatRoutes');

const app = express();
app.use(cors());
app.use(express.json());

const resend = new Resend(process.env.RESEND_API_KEY);

// تركيب راوتر الشات تحت البادئة /api
app.use('/api', chatRoutes);

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
      html: `
        <!DOCTYPE html>
        <html lang="ar" dir="rtl">
        <head><meta charset="UTF-8"></head>
        <body style="margin:0;padding:20px;background:#0b0b0b;color:#fff;font-family:'Cairo',Arial">
          <div style="max-width:600px;margin:0 auto;background:#151515;border-radius:18px;padding:30px;border:1px solid rgba(228,243,138,0.2)">
            <h1 style="text-align:center;color:#e4f38a">🎁 طلب إهداء جديد</h1>
            <p style="background:#121212;padding:10px 15px;border-radius:10px;border-left:4px solid #e4f38a"><strong style="color:#e4f38a">رقم الطلب:</strong> #${orderId}</p>
            <p style="background:#121212;padding:10px 15px;border-radius:10px;border-left:4px solid #e4f38a"><strong style="color:#e4f38a">من:</strong> ${sender}</p>
            <p style="background:#121212;padding:10px 15px;border-radius:10px;border-left:4px solid #e4f38a"><strong style="color:#e4f38a">إلى:</strong> ${receiver}</p>
            <p style="background:#121212;padding:10px 15px;border-radius:10px;border-left:4px solid #e4f38a"><strong style="color:#e4f38a">الجوال:</strong> ${phone}</p>
            <div style="background:#121212;padding:15px;border-radius:12px;border-left:4px solid #25d366;margin-top:15px">
              <p style="margin:0;color:#e4f38a;font-weight:bold">✨ الرسالة:</p>
              <p style="white-space:pre-wrap;line-height:1.8;margin:8px 0 0;color:#fff;font-size:15px">${message}</p>
            </div>
            <div style="text-align:center;margin-top:25px">
              <a href="https://wa.me/966${phone.replace(/\D/g,'').replace(/^0+/,'')}?text=${encodeURIComponent(message)}"
                 style="display:inline-block;background:#25d366;color:#fff;padding:12px 24px;border-radius:30px;text-decoration:none;font-weight:bold">
                 📱 ارسال عبر واتساب
              </a>
            </div>
          </div>
        </body>
        </html>
      `
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
