
function showToast(msg, isError) {
  const toastEl = document.getElementById('toast');
  if (!toastEl) return;

  toastEl.textContent = msg;
  toastEl.style.background = isError ? '#3f1d1d' : '#111827';
  toastEl.style.color = isError ? '#ffe8e8' : '#eafff0';
  toastEl.classList.add('show');

  if (!isError) {
    try {
      const snd = new Audio('https://cdn.jsdelivr.net/gh/itskhaleddev/sounds@main/ping-soft.mp3');
      snd.play().catch(() => {});
    } catch (e) {}
  }

  setTimeout(() => {
    toastEl.classList.remove('show');
  }, 5000);
}

function clearErrors() {
  const form = document.getElementById('giftForm');
  form.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
  form.querySelectorAll('.error-msg').forEach(el => el.remove());
}

function showError(input, msg) {
  input.classList.add('error');
  let msgEl = input.parentElement.querySelector('.error-msg');
  if (!msgEl) {
    msgEl = document.createElement('div');
    msgEl.className = 'error-msg';
    msgEl.setAttribute('role', 'alert');
    input.parentElement.appendChild(msgEl);
  }
  msgEl.textContent = msg;
}

function updatePreview() {
  const sender = document.getElementById('sender');
  const receiver = document.getElementById('receiver');
  const message = document.getElementById('message');
  const pvFrom = document.getElementById('pvFrom');
  const pvTo = document.getElementById('pvTo');
  const pvMsg = document.getElementById('pvMsg');

  pvFrom.textContent = `من: ${sender.value.trim() || '—'}`;
  pvTo.textContent = `إلى: ${receiver.value.trim() || '—'}`;
  pvMsg.textContent = message.value.trim() || 'اكتب رسالتك ليظهر شكلها هنا…';
}

function updateCounter() {
  const message = document.getElementById('message');
  const counter = document.getElementById('counter');
  counter.textContent = `${message.value.length} / 280`;
}

function disableBtn() {
  const btn = document.querySelector('button[type="submit"]');
  btn.disabled = true;
  btn.textContent = 'جارٍ الإرسال...';
}

function enableBtn() {
  const btn = document.querySelector('button[type="submit"]');
  btn.disabled = false;
  btn.textContent = 'إرسال الطلب';
}

function resetFormEffects() {
  const form = document.getElementById('giftForm');
  form.reset();
  clearErrors();
  const counter = document.getElementById('counter');
  counter.textContent = '0 / 280';
  updatePreview();
}
