// ملف الربط - يربط send.js مع effects.js

const form = document.getElementById('giftForm');
const submitBtn = form.querySelector('button[type="submit"]');
const orderId = document.getElementById('orderId');
const sender = document.getElementById('sender');
const receiver = document.getElementById('receiver');
const phone = document.getElementById('phone');
const message = document.getElementById('message');
const counter = document.getElementById('counter');

const pvTo = document.getElementById('pvTo');
const pvFrom = document.getElementById('pvFrom');
const pvMsg = document.getElementById('pvMsg');
const pvAttach = document.getElementById('pvAttach');

const toastEl = document.getElementById('toast');

const fileInput = document.getElementById('file');
const uploader = document.getElementById('uploader');
const uploaderMeta = document.getElementById('uploaderMeta');


function digitsOnly(el) {
  el.addEventListener('input', () => {
    el.value = el.value.replace(/\D/g, '');
  });
}
digitsOnly(orderId);
digitsOnly(phone);

pvMsg.style.whiteSpace = 'pre-wrap';
[sender, receiver, message].forEach(el => {
  el.addEventListener('input', updatePreview);
});

message.addEventListener('input', () => {
  updateCounter();
});

updatePreview();

const tabs = document.querySelectorAll('.tab');
const pills = document.querySelectorAll('.phrases-scroll .pill');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(x => x.classList.remove('is-active'));
    tab.classList.add('is-active');
    const cat = tab.dataset.cat;
    pills.forEach(p => {
      p.style.display = (cat === 'all' || p.dataset.cat === cat)
        ? 'inline-flex'
        : 'none';
    });
  });
});

const phrasesEl = document.getElementById('phrases');
phrasesEl?.addEventListener('click', (e) => {
  const btn = e.target.closest('.pill');
  if (!btn) return;
  phrasesEl.querySelectorAll('.pill.is-selected')
    .forEach(x => x.classList.remove('is-selected'));
  btn.classList.add('is-selected');

  const mainText = btn.textContent.trim().replace(/\.$/, '');
  const signature = "\n\nآخر السطر نقطة 🖤";
  const finalText = `${mainText}${signature}`;
  message.value = finalText.slice(0, 280);

  updateCounter();
  updatePreview();
});

function setMeta() {
  const f = fileInput.files && fileInput.files[0];
  if (!f) {
    uploaderMeta.hidden = true;
    uploaderMeta.textContent = '';
    return;
  }
  uploaderMeta.hidden = false;
  uploaderMeta.textContent = `${f.name} — ${(f.size / 1024 / 1024).toFixed(1)} MB`;
}

fileInput?.addEventListener('change', () => {
  pvAttach.innerHTML = '';
  pvAttach.classList.remove('show');

  const files = Array.from(fileInput.files || []);
  if (!files.length) { setMeta(); return; }

  let hasValid = false;

  files.forEach(f => {
    const isImage = /^image\/(png|jpe?g|webp|gif)$/i.test(f.type);
    const isVideo = /^video\/(mp4|webm|ogg)$/i.test(f.type);
    const isPDF = f.type === 'application/pdf';
    const okType = isImage || isVideo || isPDF;
    const okSize = f.size <= 8 * 1024 * 1024;

    if (!okType || !okSize) return;
    hasValid = true;

    const tile = document.createElement('div');
    tile.className = 'tile';

    if (isImage) {
      const img = document.createElement('img');
      img.alt = f.name;
      img.src = URL.createObjectURL(f);
      tile.appendChild(img);
    } else if (isVideo) {
      const vid = document.createElement('video');
      vid.src = URL.createObjectURL(f);
      vid.controls = true;
      vid.playsInline = true;
      vid.muted = true;
      tile.appendChild(vid);
    } else {
      const pdfThumb = document.createElement('img');
      pdfThumb.alt = 'PDF';
      pdfThumb.src = 'data:image/svg+xml;utf8,' + encodeURIComponent(`
          <svg xmlns="http://www.w3.org/2000/svg" width="220" height="160">
            <rect width="100%" height="100%" rx="14" fill="#1a1a1a"/>
            <rect x="24" y="22" width="172" height="116" rx="10" fill="#222" stroke="#333"/>
            <text x="50%" y="54%" text-anchor="middle"
                  font-family="Arial" font-size="36" fill="#e4f38a">PDF</text>
          </svg>`);
      tile.appendChild(pdfThumb);
    }

    const details = document.createElement('div');
    details.className = 'meta';
    details.innerHTML = `<b>${f.name}</b><br>${(f.size / 1024 / 1024).toFixed(1)} MB`;
    tile.appendChild(details);

    pvAttach.appendChild(tile);
  });

  if (!hasValid) {
    showToast('الملف غير صالح (صور/فيديو/PDF حتى 8MB)', true);
    fileInput.value = '';
    setMeta();
    return;
  }

  pvAttach.classList.add('show');
  setMeta();
});

if (uploader) {
  ['dragenter', 'dragover'].forEach(ev => {
    uploader.addEventListener(ev, e => {
      e.preventDefault();
      e.stopPropagation();
      uploader.classList.add('dragover');
    });
  });

  ['dragleave', 'dragend', 'drop'].forEach(ev => {
    uploader.addEventListener(ev, e => {
      e.preventDefault();
      e.stopPropagation();
      uploader.classList.remove('dragover');
    });
  });

  uploader.addEventListener('drop', (e) => {
    if (!e.dataTransfer?.files?.length) return;
    fileInput.files = e.dataTransfer.files;
    fileInput.dispatchEvent(new Event('change', { bubbles: true }));
  });
}

// ✅ حدث الإرسال - يستخدم send.js و effects.js
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  clearErrors();

  let invalid = false;
  if (!orderId.value.trim()) { showError(orderId, 'اكتب رقم الطلب'); invalid = true; }
  if (!sender.value.trim()) { showError(sender, 'اكتب اسم المرسل'); invalid = true; }
  if (!receiver.value.trim()) { showError(receiver, 'اكتب اسم المُهدى له'); invalid = true; }

  if (!phone.value.trim()) {
    showError(phone, 'عبّ رقم الجوال'); invalid = true;
  } else if (!/^05\d{8}$/.test(phone.value)) {
    showError(phone, 'رقم الجوال لازم يبدأ بـ 05 ويتكون من 10 أرقام'); invalid = true;
  }

  if (!message.value.trim()) {
    showError(message, 'اكتب نص الإهداء'); invalid = true;
  }

  if (orderId.value && (orderId.value.length < 6 || orderId.value.length > 12)) {
    showError(orderId, 'رقم الطلب من 6 إلى 12 رقم'); invalid = true;
  }

  const f = fileInput.files[0];
  if (f) {
    const isImage = /^image\/(png|jpe?g|webp|gif)$/i.test(f.type);
    const isVideo = /^video\/(mp4|webm|ogg)$/i.test(f.type);
    const isPDF = f.type === 'application/pdf';
    const okType = isImage || isVideo || isPDF;
    const okSize = f.size <= 8 * 1024 * 1024;
    if (!okType || !okSize) {
      showError(fileInput, 'الملف غير مسموح أو أكبر من 8MB');
      invalid = true;
    }
  }

  if (invalid) {
    const firstErr = form.querySelector('.error');
    if (firstErr) {
      firstErr.focus({ preventScroll: true });
      firstErr.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    showToast('تحقّق من الحقول المطلوبة', true);
    return;
  }

  // ✅ استخدام send.js و effects.js
  disableBtn();
  const result = await submitForm();
  enableBtn();

  if (result.ok) {
    showToast('💌 تم استقبال طلبك بنجاح!');
    resetFormEffects();
  } else {
    showToast('تعذّر الإرسال، حاول لاحقًا', true);
  }
});
// أضِف بعد تعريف المتغيرات مباشرة
function updateCounter() {
  if (!message || !counter) return;
  const len = message.value.length;
  counter.textContent = `${len} / 280`;
  // لون تحذيري عند الاقتراب من الحد
  counter.style.color = len > 250 ? '#ff9b9b' : '#a9a9a9';
}
window.updateCounter = updateCounter;
function updatePreview() {
  if (pvMsg) {
    pvMsg.textContent = (message.value || '').trim() || 'اكتب رسالتك ليظهر شكلها هنا…';
  }
  if (pvTo) {
    pvTo.textContent = 'إلى: ' + ((receiver.value || '').trim() || '—');
  }
  if (pvFrom) {
    pvFrom.textContent = 'من: ' + ((sender.value || '').trim() || '—');
  }
}
window.updatePreview = updatePreview;