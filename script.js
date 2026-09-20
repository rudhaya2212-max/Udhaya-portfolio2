/**
 * Portfolio JavaScript - Udhaya
 * Handles mobile navigation, smooth scrolling, active link highlighting,
 * and contact form validation/feedback without any external dependencies.
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNavigation();
  initActiveNavOnScroll();
  initContactForm();
});

/**
 * Mobile Navigation Toggle and Link Handling
 */
function initMobileNavigation() {
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!menuToggle || !navMenu) return;

  function toggleMenu(forceState) {
    const isCurrentlyOpen = navMenu.classList.contains('is-open');
    const shouldOpen = forceState !== undefined ? forceState : !isCurrentlyOpen;

    if (shouldOpen) {
      navMenu.classList.add('is-open');
      menuToggle.classList.add('is-active');
      menuToggle.setAttribute('aria-expanded', 'true');
    } else {
      navMenu.classList.remove('is-open');
      menuToggle.classList.remove('is-active');
      menuToggle.setAttribute('aria-expanded', 'false');
    }
  }

  // Toggle button click
  menuToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  // Close menu when clicking on any nav link
  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        toggleMenu(false);
      }
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768 && navMenu.classList.contains('is-open')) {
      if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
        toggleMenu(false);
      }
    }
  });

  // Close menu on Escape key press
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('is-open')) {
      toggleMenu(false);
      menuToggle.focus();
    }
  });

  // Handle resize to clean up state if switched to desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && navMenu.classList.contains('is-open')) {
      toggleMenu(false);
    }
  });
}

/**
 * Highlights current section link in navigation when scrolling
 */
function initActiveNavOnScroll() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!sections.length || !navLinks.length) return;

  function updateActiveLink() {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;
    const navHeight = 90; // header height + offset

    let currentSectionId = '';

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - navHeight;
      const sectionHeight = section.offsetHeight;

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    // Fallback if at the very top
    if (scrollY < 100 && sections[0]) {
      currentSectionId = sections[0].getAttribute('id');
    }

    navLinks.forEach((link) => {
      const linkHref = link.getAttribute('href');
      if (linkHref === `#${currentSectionId}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });
  updateActiveLink();
}

/**
 * Contact Form Client-side Validation & Feedback
 */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const nameInput = document.getElementById('userName');
  const emailInput = document.getElementById('userEmail');
  const messageInput = document.getElementById('userMessage');

  const nameError = document.getElementById('nameError');
  const emailError = document.getElementById('emailError');
  const messageError = document.getElementById('messageError');
  const formFeedback = document.getElementById('formFeedback');

  function clearErrors() {
    [nameInput, emailInput, messageInput].forEach((input) => {
      if (input) input.classList.remove('is-invalid');
    });
    if (nameError) nameError.textContent = '';
    if (emailError) emailError.textContent = '';
    if (messageError) messageError.textContent = '';
    if (formFeedback) {
      formFeedback.textContent = '';
      formFeedback.className = 'form-feedback';
    }
  }

  // Clear errors when typing
  [nameInput, emailInput, messageInput].forEach((input) => {
    if (!input) return;
    input.addEventListener('input', () => {
      input.classList.remove('is-invalid');
      const errEl = document.getElementById(input.name + 'Error');
      if (errEl) errEl.textContent = '';
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    clearErrors();

    let isValid = true;

    // Validate Name
    const nameVal = nameInput ? nameInput.value.trim() : '';
    if (!nameVal) {
      if (nameInput) nameInput.classList.add('is-invalid');
      if (nameError) nameError.textContent = 'Please enter your name.';
      isValid = false;
    }

    // Validate Email
    const emailVal = emailInput ? emailInput.value.trim() : '';
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailVal) {
      if (emailInput) emailInput.classList.add('is-invalid');
      if (emailError) emailError.textContent = 'Please enter your email address.';
      isValid = false;
    } else if (!emailPattern.test(emailVal)) {
      if (emailInput) emailInput.classList.add('is-invalid');
      if (emailError) emailError.textContent = 'Please enter a valid email address.';
      isValid = false;
    }

    // Validate Message
    const messageVal = messageInput ? messageInput.value.trim() : '';
    if (!messageVal) {
      if (messageInput) messageInput.classList.add('is-invalid');
      if (messageError) messageError.textContent = 'Please enter your message.';
      isValid = false;
    } else if (messageVal.length < 5) {
      if (messageInput) messageInput.classList.add('is-invalid');
      if (messageError) messageError.textContent = 'Message should be at least 5 characters.';
      isValid = false;
    }

    if (!isValid) return;

    // Successful client-side submission simulation
    form.reset();
    if (formFeedback) {
      formFeedback.textContent = 'Thank you! Your message has been sent successfully.';
      formFeedback.className = 'form-feedback success';
    }

    // Auto clear feedback after 6 seconds
    setTimeout(() => {
      if (formFeedback && formFeedback.classList.contains('success')) {
        formFeedback.textContent = '';
        formFeedback.className = 'form-feedback';
      }
    }, 6000);
  });
}
