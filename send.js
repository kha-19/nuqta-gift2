// front-end: يستدعي دالة نتلاي فقط
async function submitForm() {
  const orderId = document.getElementById('orderId').value.trim();
  const sender  = document.getElementById('sender').value.trim();
  const receiver= document.getElementById('receiver').value.trim();
  const phone   = document.getElementById('phone').value.trim();
  const message = document.getElementById('message').value.trim();
  const fileInput = document.getElementById('file');

  if (!orderId || !sender || !receiver || !phone || !message) {
    return { ok: false };
  }

  // إنشاء FormData لدعم رفع الملفات
  const formData = new FormData();
  formData.append('orderId', orderId);
  formData.append('sender', sender);
  formData.append('receiver', receiver);
  formData.append('phone', phone);
  formData.append('message', message);

  // إضافة الملف إن وُجد
  if (fileInput && fileInput.files && fileInput.files[0]) {
    formData.append('attachment', fileInput.files[0]);
  }

  try {
    const res = await fetch("/.netlify/functions/send", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    return data; // فيها ok: true/false
  } catch (err) {
    console.error("Submission error:", err);
    return { ok: false };
  }
}
