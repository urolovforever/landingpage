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

// Google Sheets API endpoint
const GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/AKfycbwBeMx4n2uXBitHEOrj-HW96AJckJbtxzcarAFhNWnJVJMVz52lU9LymgzlOG_CSca5/exec';

// Save lead to Google Sheets
async function saveLead(data) {
  try {
    // Save to localStorage as backup
    const leads = JSON.parse(localStorage.getItem('tiu_leads') || '[]');
    leads.push({
      ...data,
      createdAt: new Date().toISOString()
    });
    localStorage.setItem('tiu_leads', JSON.stringify(leads));

    // Send to Google Sheets
    const response = await fetch(GOOGLE_SHEETS_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'text/plain',
      },
      body: JSON.stringify({
        fullName: data.fullName,
        phone: String(data.phone),
        telegram: data.telegram || ''
      })
    });

    console.log('Lead saved to Google Sheets');
    return true;
  } catch (error) {
    console.error('Error saving to Google Sheets:', error);
    return false;
  }
}

// Form submit handler with validation
function handleFormSubmit(e) {
  e.preventDefault();

  const form = e.target;
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

// ========== ADMIN: View all leads (for testing) ==========
// Open browser console and type: viewLeads() to see all saved leads
window.viewLeads = function() {
  const leads = JSON.parse(localStorage.getItem('tiu_leads') || '[]');
  console.table(leads);
  return leads;
};

// Export leads as CSV
window.exportLeadsCSV = function() {
  const leads = JSON.parse(localStorage.getItem('tiu_leads') || '[]');
  if (leads.length === 0) {
    console.log('No leads to export');
    return;
  }

  const headers = ['ID', 'Ism', 'Telefon', 'Telegram', 'Sana'];
  const csv = [
    headers.join(','),
    ...leads.map(lead => [
      lead.id,
      `"${lead.fullName}"`,
      `"${lead.phone}"`,
      `"${lead.telegram}"`,
      `"${lead.createdAt}"`
    ].join(','))
  ].join('\n');

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'tiu_leads.csv';
  a.click();
  console.log('CSV exported!');
};
