// ========== NAVBAR SCROLL EFFECT ==========
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// ========== HAMBURGER MENU ==========
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('active');
});

// ========== SCROLL REVEAL ANIMATION ==========
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, {
  threshold: 0.15,
  rootMargin: '0px 0px -40px 0px'
});

document.querySelectorAll('.reveal').forEach(el => {
  revealObserver.observe(el);
});

// ========== FAQ TOGGLE ==========
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.parentElement;
    const wasActive = item.classList.contains('active');

    // Close all FAQ items
    document.querySelectorAll('.faq-item').forEach(i => {
      i.classList.remove('active');
    });

    // Toggle current item
    if (!wasActive) {
      item.classList.add('active');
    }
  });
});

// ========== FORM VALIDATION ==========
const successModal = document.getElementById('successModal');
const modalCloseBtn = document.getElementById('modalClose');

// Phone number validation - Uzbekistan format
function validatePhone(phone) {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');

  // Check if it's a valid Uzbek number (998 + 9 digits = 12 digits total)
  if (cleaned.length === 12 && cleaned.startsWith('998')) {
    return true;
  }
  // Also accept 9 digits without country code
  if (cleaned.length === 9) {
    return true;
  }
  return false;
}

// Format phone number as user types
function formatPhoneNumber(value) {
  const cleaned = value.replace(/\D/g, '');

  if (cleaned.length === 0) return '';

  // If starts with 998, format as +998 XX XXX XX XX
  if (cleaned.startsWith('998')) {
    let formatted = '+998';
    if (cleaned.length > 3) formatted += ' ' + cleaned.slice(3, 5);
    if (cleaned.length > 5) formatted += ' ' + cleaned.slice(5, 8);
    if (cleaned.length > 8) formatted += ' ' + cleaned.slice(8, 10);
    if (cleaned.length > 10) formatted += ' ' + cleaned.slice(10, 12);
    return formatted;
  }

  // Otherwise format as XX XXX XX XX
  let formatted = cleaned.slice(0, 2);
  if (cleaned.length > 2) formatted += ' ' + cleaned.slice(2, 5);
  if (cleaned.length > 5) formatted += ' ' + cleaned.slice(5, 7);
  if (cleaned.length > 7) formatted += ' ' + cleaned.slice(7, 9);

  return formatted;
}

// Validate name
function validateName(name) {
  return name.trim().length >= 3;
}

// Show error message
function showError(inputId, errorId, message) {
  const input = document.getElementById(inputId);
  const error = document.getElementById(errorId);
  if (input && error) {
    input.classList.add('input-error');
    error.textContent = message;
    error.style.display = 'block';
  }
}

// Clear error message
function clearError(inputId, errorId) {
  const input = document.getElementById(inputId);
  const error = document.getElementById(errorId);
  if (input && error) {
    input.classList.remove('input-error');
    error.textContent = '';
    error.style.display = 'none';
  }
}

const _e = ['aHR0cHM6Ly9zY3JpcHQuZ29vZ2xlLmNvbS9tYWNyb3Mvcy9BS2Z5Y2J3Skp3dFJIMHdF', 'SExKZzlrVk9kVXNSUE1KeHlwZDQ1cGlsOFJUZUtlaHVweXFNZkdNemJ0b2UyQ29YN000Rml2S3QvZXhlYw=='];
const _d = (s) => atob(s);
const _getEndpoint = () => _d(_e[0]) + _d(_e[1]);
const _k = 'tiu2026';
const _encrypt = (text) => {
  return btoa(encodeURIComponent(text).split('').map((c, i) =>
    String.fromCharCode(c.charCodeAt(0) ^ _k.charCodeAt(i % _k.length))
  ).join(''));
};
const _decrypt = (encoded) => {
  try {
    return decodeURIComponent(atob(encoded).split('').map((c, i) =>
      String.fromCharCode(c.charCodeAt(0) ^ _k.charCodeAt(i % _k.length))
    ).join(''));
  } catch { return null; }
};

// Save lead to database
async function saveLead(data) {
  try {
    // Save encrypted backup locally
    const stored = localStorage.getItem('_tiu_d');
    const leads = stored ? JSON.parse(_decrypt(stored) || '[]') : [];
    leads.push({
      ...data,
      t: new Date().toISOString()
    });
    localStorage.setItem('_tiu_d', _encrypt(JSON.stringify(leads)));

    // Send to server
    await fetch(_getEndpoint(), {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({
        fullName: data.fullName,
        phone: String(data.phone),
        telegram: data.telegram || ''
      })
    });
    return true;
  } catch (e) {
    return false;
  }
}

let lastSubmitTime = 0;
const SUBMIT_COOLDOWN = 30000;

// Form submit handler with validation
function handleFormSubmit(e) {
  e.preventDefault();

  const form = e.target;

  // Security: Honeypot check
  const honeypot = form.querySelector('#website');
  if (honeypot && honeypot.value !== '') {
    return;
  }

  // Security: Rate limiting (tez-tez yuborishni oldini olish)
  const now = Date.now();
  if (now - lastSubmitTime < SUBMIT_COOLDOWN) {
    const remainingTime = Math.ceil((SUBMIT_COOLDOWN - (now - lastSubmitTime)) / 1000);
    alert(`Iltimos, ${remainingTime} soniya kuting va qayta urinib ko'ring.`);
    return;
  }

  const fullName = form.querySelector('#fullName');
  const phone = form.querySelector('#phone');
  const telegram = form.querySelector('#telegram');

  let isValid = true;

  // Validate name
  if (!fullName || !validateName(fullName.value)) {
    showError('fullName', 'nameError', 'Ism kamida 3 ta harf bo\'lishi kerak');
    isValid = false;
  } else {
    clearError('fullName', 'nameError');
  }

  // Validate phone
  if (!phone || !validatePhone(phone.value)) {
    showError('phone', 'phoneError', 'To\'g\'ri telefon raqam kiriting: +998 XX XXX XX XX');
    isValid = false;
  } else {
    clearError('phone', 'phoneError');
  }

  if (!isValid) {
    return;
  }

  // Collect form data
  const formData = {
    fullName: fullName.value.trim(),
    phone: phone.value.trim(),
    telegram: telegram ? telegram.value.trim() : ''
  };

  // Security: Input sanitization (maxsus belgilarni tozalash)
  formData.fullName = formData.fullName.replace(/[<>\"'&]/g, '');
  formData.telegram = formData.telegram.replace(/[<>\"'&]/g, '');

  // Rate limiting uchun vaqtni saqlash
  lastSubmitTime = Date.now();

  // Save to localStorage
  saveLead(formData);

  // Show success modal
  successModal.style.display = 'flex';

  // Reset form
  form.reset();
}

// Attach event listeners
const leadForm = document.getElementById('leadForm');

if (leadForm) {
  leadForm.addEventListener('submit', handleFormSubmit);

  // Phone input formatting
  const phoneInput = leadForm.querySelector('#phone');
  if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
      const formatted = formatPhoneNumber(e.target.value);
      e.target.value = formatted;
    });

    // Auto-add +998 prefix on focus if empty
    phoneInput.addEventListener('focus', (e) => {
      if (!e.target.value) {
        e.target.value = '+998 ';
      }
    });
  }

  // Clear errors on input
  const nameInput = leadForm.querySelector('#fullName');
  if (nameInput) {
    nameInput.addEventListener('input', () => {
      clearError('fullName', 'nameError');
    });
  }
  if (phoneInput) {
    phoneInput.addEventListener('input', () => {
      clearError('phone', 'phoneError');
    });
  }
}

// Close modal
modalCloseBtn.addEventListener('click', () => {
  successModal.style.display = 'none';
});

// Close modal on overlay click
successModal.addEventListener('click', (e) => {
  if (e.target === successModal) {
    successModal.style.display = 'none';
  }
});

// ========== SMOOTH SCROLL FOR ANCHOR LINKS ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    const target = document.querySelector(targetId);

    if (target) {
      // Close mobile menu if open
      if (navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
      }

      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

