/**
 * AI Czochralski Landing Page - Main JavaScript
 * Modern vanilla JS with modular structure
 */

// ===================================
// DOM Ready Handler
// ===================================
document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initScrollAnimations();
  initHeaderScroll();
  initSmoothScroll();
  initParticles();
});

// ===================================
// Mobile Menu Toggle
// ===================================
/**
 * Initializes mobile menu toggle functionality
 */
function initMobileMenu() {
  const menuToggle = document.getElementById('menuToggle');
  const nav = document.getElementById('nav');
  
  if (!menuToggle || !nav) return;
  
  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    nav.classList.toggle('active');
    
    // Update ARIA attribute for accessibility
    const isExpanded = menuToggle.classList.contains('active');
    menuToggle.setAttribute('aria-expanded', isExpanded);
  });
  
  // Close menu when clicking on a link
  const navLinks = nav.querySelectorAll('.header__nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('active');
      nav.classList.remove('active');
    });
  });
}

// ===================================
// Scroll Animations (Intersection Observer)
// ===================================
/**
 * Initializes scroll-triggered fade-in animations
 */
function initScrollAnimations() {
  // Select elements to animate
  const animatedElements = document.querySelectorAll(
    '.about__grid, .problem__card, .advantages__card, .process__step, ' +
    '.opportunities__card, .cases__card, .techstack__item, .member-card'
  );
  
  // Add fade-in-up class to all elements
  animatedElements.forEach(el => {
    el.classList.add('fade-in-up');
  });
  
  // Create Intersection Observer
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Optionally unobserve after animation
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });
  
  // Observe all animated elements
  animatedElements.forEach(el => observer.observe(el));
}

// ===================================
// Header Scroll Effect
// ===================================
/**
 * Adds scrolled class to header when page is scrolled
 */
function initHeaderScroll() {
  const header = document.getElementById('header');
  
  if (!header) return;
  
  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }
  };
  
  // Throttle scroll events for performance
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        handleScroll();
        ticking = false;
      });
      ticking = true;
    }
  });
  
  // Initial check
  handleScroll();
}

// ===================================
// Smooth Scroll for Anchor Links
// ===================================
/**
 * Initializes smooth scrolling for anchor links
 */
function initSmoothScroll() {
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  
  anchorLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      
      // Skip if it's just "#" or empty
      if (href === '#' || href === '') return;
      
      const targetId = href.substring(1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        e.preventDefault();
        
        // Calculate offset for fixed header
        const headerOffset = 70;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
        
        // Update URL without scrolling
        history.pushState(null, null, href);
      }
    });
  });
}

// ===================================
// Particle Animation for Hero Section
// ===================================
/**
 * Creates floating particle effects in hero section
 */
function initParticles() {
  const particlesContainer = document.getElementById('particles');
  
  if (!particlesContainer) return;
  
  const particleCount = 20;
  
  for (let i = 0; i < particleCount; i++) {
    createParticle(particlesContainer);
  }
}

/**
 * Creates a single particle element
 * @param {HTMLElement} container - Container element
 */
function createParticle(container) {
  const particle = document.createElement('div');
  const size = Math.random() * 4 + 2;
  
  particle.style.cssText = `
    position: absolute;
    width: ${size}px;
    height: ${size}px;
    background: linear-gradient(135deg, #3b82f6, #10b981);
    border-radius: 50%;
    opacity: ${Math.random() * 0.5 + 0.2};
    left: ${Math.random() * 100}%;
    top: ${Math.random() * 100}%;
    pointer-events: none;
    animation: floatParticle ${Math.random() * 10 + 10}s ease-in-out infinite;
    animation-delay: ${Math.random() * 5}s;
  `;
  
  container.appendChild(particle);
  
  // Add keyframes dynamically if not already present
  if (!document.getElementById('particleKeyframes')) {
    const style = document.createElement('style');
    style.id = 'particleKeyframes';
    style.textContent = `
      @keyframes floatParticle {
        0%, 100% {
          transform: translate(0, 0) scale(1);
          opacity: 0.3;
        }
        25% {
          transform: translate(10px, -20px) scale(1.1);
          opacity: 0.6;
        }
        50% {
          transform: translate(-5px, -40px) scale(0.9);
          opacity: 0.4;
        }
        75% {
          transform: translate(15px, -20px) scale(1.05);
          opacity: 0.5;
        }
      }
    `;
    document.head.appendChild(style);
  }
}

// ===================================
// Utility Functions
// ===================================

/**
 * Debounce function for performance optimization
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function for performance optimization
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// ===================================
// Team Data Export (Bonus Feature)
// ===================================
/**
 * Exports team member data as JSON
 * Can be used for further processing or API integration
 */
function exportTeamData() {
  const teamCards = document.querySelectorAll('.member-card');
  const teamData = [];
  
  teamCards.forEach(card => {
    const name = card.querySelector('.member-card__name')?.textContent.trim() || '';
    const role = card.querySelector('.member-card__role')?.textContent.trim() || '';
    const contacts = [];
    
    const contactElements = card.querySelectorAll('.member-card__contact');
    contactElements.forEach(contact => {
      const text = contact.textContent.trim();
      if (text.startsWith('📞')) {
        contacts.push({ type: 'phone', value: text.replace('📞 ', '') });
      } else if (text.startsWith('✉️')) {
        contacts.push({ type: 'email', value: text.replace('✉️ ', '') });
      }
    });
    
    const social = card.querySelector('.member-card__social');
    if (social) {
      contacts.push({ 
        type: 'telegram', 
        value: social.getAttribute('href'),
        label: social.textContent.trim()
      });
    }
    
    teamData.push({ name, role, contacts });
  });
  
  console.log('Team Data:', JSON.stringify(teamData, null, 2));
  return teamData;
}

// Make exportTeamData available globally for debugging
window.exportTeamData = exportTeamData;

// ===================================
// Performance Monitoring (Optional)
// ===================================
/**
 * Logs page load performance metrics
 */
if (window.performance && window.performance.getEntriesByType) {
  window.addEventListener('load', () => {
    const navigationEntries = performance.getEntriesByType('navigation');
    if (navigationEntries.length > 0) {
      const navEntry = navigationEntries[0];
      console.log('Page Load Performance:', {
        'DNS Lookup': `${navEntry.domainLookupEnd - navEntry.domainLookupStart}ms`,
        'TCP Connection': `${navEntry.connectEnd - navEntry.connectStart}ms`,
        'DOM Content Loaded': `${navEntry.domContentLoadedEventEnd - navEntry.navigationStart}ms`,
        'Full Page Load': `${navEntry.loadEventEnd - navEntry.navigationStart}ms`
      });
    }
  });
}