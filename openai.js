// ملف الذكاء الاصطناعي - اقتراحات تحسين النص

const magicBtn = document.getElementById('magicBtn');
const aiSuggestions = document.getElementById('aiSuggestions');
const messageInput = document.getElementById('message');

if (magicBtn && aiSuggestions && messageInput) {
  magicBtn.addEventListener('click', async () => {
    const currentText = messageInput.value.trim();
    
    if (!currentText) {
      showToast('اكتب نص الإهداء أولاً', true);
      return;
    }

    // إظهار اللودر
    aiSuggestions.hidden = false;
    const loader = aiSuggestions.querySelector('.ai-loader');
    const pillsContainer = aiSuggestions.querySelector('.ai-pills');
    loader.style.display = 'flex';
    pillsContainer.innerHTML = '';

    try {
      // استدعاء دالة نتلاي
      const response = await fetch('/.netlify/functions/ai-suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: currentText })
      });

      const data = await response.json();

      // إخفاء اللودر
      loader.style.display = 'none';

      if (data.ok && data.suggestions && data.suggestions.length > 0) {
        // عرض الاقتراحات
        data.suggestions.forEach((suggestion) => {
          const pill = document.createElement('button');
          pill.type = 'button';
          pill.className = 'ai-pill';
          pill.textContent = suggestion;
          pill.addEventListener('click', () => {
            messageInput.value = suggestion;
            updateCounter();
            updatePreview();
            aiSuggestions.hidden = true;
            showToast('تم تطبيق الاقتراح ✨');
          });
          pillsContainer.appendChild(pill);
        });
      } else {
        showToast('تعذر الحصول على اقتراحات، حاول لاحقًا', true);
        aiSuggestions.hidden = true;
      }
    } catch (error) {
      console.error('AI suggestions error:', error);
      loader.style.display = 'none';
      showToast('تعذر الاتصال بالخدمة، حاول لاحقًا', true);
      aiSuggestions.hidden = true;
    }
  });

  // إخفاء الاقتراحات عند الضغط خارجها
  document.addEventListener('click', (e) => {
    if (!aiSuggestions.contains(e.target) && e.target !== magicBtn) {
      aiSuggestions.hidden = true;
    }
  });
}

