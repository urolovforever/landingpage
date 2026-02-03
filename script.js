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

// ========== FORM SUBMIT HANDLER ==========
const successModal = document.getElementById('successModal');
const modalCloseBtn = document.getElementById('modalClose');

function handleFormSubmit(e) {
  e.preventDefault();
  successModal.style.display = 'flex';
  e.target.reset();
}

// Attach submit handler to all forms
const leadForm = document.getElementById('leadForm');
const finalForm = document.getElementById('finalForm');

if (leadForm) {
  leadForm.addEventListener('submit', handleFormSubmit);
}

if (finalForm) {
  finalForm.addEventListener('submit', handleFormSubmit);
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
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});