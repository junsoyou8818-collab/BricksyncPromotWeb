// form.js - B2B 교육기관 상담 폼 처리

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID';

function initForm() {
  const form = document.getElementById('b2b-form');
  if (!form) return;

  const submitBtn = form.querySelector('.form-submit-btn');
  const charCount = document.getElementById('msg-count');
  const msgArea = document.getElementById('b2b-message');

  if (msgArea && charCount) {
    msgArea.addEventListener('input', () => {
      charCount.textContent = msgArea.value.length;
    });
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validateForm(form)) return;

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner"></span> 전송 중...';

    try {
      const data = new FormData(form);
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' }
      });

      if (res.ok) {
        showToast('문의가 성공적으로 전송되었습니다! 담당자가 확인 후 연락드리겠습니다.', 'success');
        form.reset();
        if (charCount) charCount.textContent = '0';
      } else {
        throw new Error('전송 실패');
      }
    } catch {
      showToast('전송 중 오류가 발생했습니다. 이메일로 직접 문의해주세요.', 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '도입 문의 보내기 <span>→</span>';
    }
  });
}

function validateForm(form) {
  let valid = true;
  form.querySelectorAll('[required]').forEach(el => {
    const err = el.closest('.form-group')?.querySelector('.form-error');
    if (!el.value.trim()) {
      el.classList.add('invalid');
      if (err) err.style.display = 'block';
      valid = false;
    } else {
      el.classList.remove('invalid');
      if (err) err.style.display = 'none';
    }
  });

  const consent = form.querySelector('#b2b-consent');
  const consentErr = form.querySelector('#consent-error');
  if (consent && !consent.checked) {
    if (consentErr) consentErr.style.display = 'block';
    valid = false;
  } else if (consentErr) {
    consentErr.style.display = 'none';
  }

  return valid;
}

function showToast(msg, type = 'success') {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.className = 'toast ' + type + ' show';
  setTimeout(() => toast.classList.remove('show'), 5000);
}

document.addEventListener('DOMContentLoaded', initForm);
