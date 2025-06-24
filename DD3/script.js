/**
 * ========================================================================
 * CARL STORMS DIGITAL DOSSIER - CLEAN VERSION
 * Simple, working JavaScript with PDF downloads
 * ========================================================================
 */

/**
 * ========================================================================
 * CONFIGURATION SETTINGS
 * Easy-to-modify settings for site behavior
 * ========================================================================
 */

const SITE_CONFIG = {
  // Employment Status Settings
  showAvailabilityStatus: true,
  isAvailableForWork: true,
  availabilityMessage: 'Available',
  unavailabilityMessage: 'Not Available',
  
  // Status Colors
  availableColor: '#059669',
  unavailableColor: '#64748b',
  
  // Animation Settings
  enableAnimations: true,
  
  // PDF Settings
  pdfFiles: {
    resume: 'Carl_Storms_Resume.pdf',
    cv: 'Carl_Storms_CV.pdf'
  },
  
  // Notification Settings
  notificationDuration: 5000
};

/**
 * ========================================================================
 * PDF DOWNLOAD FUNCTIONS
 * Handle PDF downloads - defined globally for onclick handlers
 * ========================================================================
 */

/**
 * Downloads the specified PDF file
 * @param {string} type - Either 'resume' or 'cv'
 */
function downloadPDF(type) {
  console.log('downloadPDF called with type:', type);
  
  const filename = SITE_CONFIG.pdfFiles[type];
  
  if (!filename) {
    console.error('Invalid PDF type:', type);
    showNotification('PDF type not found', 'error');
    return;
  }
  
  console.log('Attempting to download:', filename);
  
  // Show loading state
  showPDFLoading();
  
  try {
    // Create download link
    const link = document.createElement('a');
    link.href = filename;
    link.download = filename;
    link.target = '_blank';
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log('Download triggered successfully');
    
    // Show success message
    setTimeout(() => {
      showPDFSuccess();
      hidePDFLoading();
    }, 500);
    
  } catch (error) {
    console.error('PDF Download Error:', error);
    showPDFError('Failed to download PDF');
    hidePDFLoading();
  }
}

/**
 * Shows loading state on download button
 */
function showPDFLoading() {
  const button = document.querySelector('.download-btn');
  if (button) {
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>Preparing...</span>';
    button.disabled = true;
    button.classList.add('loading');
  }
}

/**
 * Hides loading state on download button
 */
function hidePDFLoading() {
  const button = document.querySelector('.download-btn');
  if (button) {
    button.innerHTML = '<i class="fas fa-download"></i><span>Download PDF</span>';
    button.disabled = false;
    button.classList.remove('loading');
  }
}

/**
 * Shows success message
 */
function showPDFSuccess() {
  showNotification('PDF download started successfully!', 'success');
}

/**
 * Shows error message
 */
function showPDFError(message) {
  showNotification(message, 'error');
}

/**
 * ========================================================================
 * NOTIFICATION SYSTEM
 * Simple toast notifications
 * ========================================================================
 */

/**
 * Shows a notification message
 * @param {string} message - Message to display
 * @param {string} type - success, error, warning, info
 */
function showNotification(message, type = 'info') {
  // Create notification element
  const notification = document.createElement('div');
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 12px 16px;
    border-radius: 8px;
    color: white;
    font-weight: 500;
    z-index: 1000;
    max-width: 300px;
    word-wrap: break-word;
    cursor: pointer;
    transform: translateX(100%);
    transition: transform 0.3s ease-out;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  `;
  
  // Set background color based on type
  const colors = {
    success: '#059669',
    error: '#dc2626',
    warning: '#d97706',
    info: '#2563eb'
  };
  notification.style.backgroundColor = colors[type] || colors.info;
  
  // Add to page
  document.body.appendChild(notification);
  
  // Slide in
  setTimeout(() => {
    notification.style.transform = 'translateX(0)';
  }, 100);
  
  // Auto remove
  setTimeout(() => {
    removeNotification(notification);
  }, SITE_CONFIG.notificationDuration);
  
  // Remove on click
  notification.addEventListener('click', () => {
    removeNotification(notification);
  });
}

/**
 * Removes notification with animation
 */
function removeNotification(notification) {
  notification.style.transform = 'translateX(100%)';
  setTimeout(() => {
    if (notification.parentNode) {
      notification.remove();
    }
  }, 300);
}

/**
 * ========================================================================
 * MAKE FUNCTIONS GLOBALLY AVAILABLE
 * Export functions for HTML onclick handlers
 * ========================================================================
 */

// Make functions available globally for onclick handlers
window.downloadPDF = downloadPDF;
window.showNotification = showNotification;

/**
 * ========================================================================
 * INITIALIZATION
 * Set up the site when DOM is ready
 * ========================================================================
 */

document.addEventListener('DOMContentLoaded', function() {
  console.log('Initializing Carl Storms Digital Dossier...');
  
  try {
    // Set current year
    setCurrentYear();
    
    // Set active navigation
    setActiveNavigation();
    
    // Initialize navigation
    initializeNavigation();
    
    // Initialize availability status
    initializeAvailabilityStatus();
    
    // Initialize animations if enabled
    if (SITE_CONFIG.enableAnimations) {
      initializeAnimations();
    }
    
    console.log('Site initialized successfully');
    
  } catch (error) {
    console.error('Initialization error:', error);
  }
});

/**
 * ========================================================================
 * UTILITY FUNCTIONS
 * Helper functions for site functionality
 * ========================================================================
 */

/**
 * Sets current year in footer
 */
function setCurrentYear() {
  const yearElements = document.querySelectorAll('#current-year');
  const currentYear = new Date().getFullYear();
  
  yearElements.forEach(element => {
    if (element) {
      element.textContent = currentYear;
    }
  });
}

/**
 * Sets active navigation link
 */
function setActiveNavigation() {
  const currentPage = getCurrentPage();
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach(link => {
    const linkPage = link.getAttribute('href') || '';
    link.classList.remove('active');
    
    if (isCurrentPage(linkPage, currentPage)) {
      link.classList.add('active');
    }
  });
}

/**
 * Gets current page from URL
 */
function getCurrentPage() {
  const path = window.location.pathname;
  return path.split('/').pop() || 'index.html';
}

/**
 * Checks if link matches current page
 */
function isCurrentPage(linkPage, currentPage) {
  return linkPage === currentPage || 
         (currentPage === '' && linkPage === 'index.html') ||
         (currentPage === 'index.html' && linkPage === '') ||
         (currentPage === '/' && linkPage === 'index.html');
}

/**
 * ========================================================================
 * NAVIGATION FUNCTIONS
 * Mobile menu and navigation behavior
 * ========================================================================
 */

/**
 * Initialize navigation functionality
 */
function initializeNavigation() {
  setupMobileMenu();
  enhanceNavigationInteractions();
  handleNavigationResponsive();
}

/**
 * Set up mobile menu
 */
function setupMobileMenu() {
  const mobileToggle = document.querySelector('.mobile-menu-toggle');
  const navMenu = document.querySelector('.nav-menu');
  
  if (!mobileToggle || !navMenu) return;
  
  // Toggle menu on button click
  mobileToggle.addEventListener('click', function() {
    toggleMobileMenu(navMenu, mobileToggle);
  });
  
  // Close menu when clicking outside
  document.addEventListener('click', function(event) {
    if (!mobileToggle.contains(event.target) && !navMenu.contains(event.target)) {
      closeMobileMenu(navMenu, mobileToggle);
    }
  });
  
  // Close menu on Escape key
  document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
      closeMobileMenu(navMenu, mobileToggle);
    }
  });
}

/**
 * Toggle mobile menu
 */
function toggleMobileMenu(navMenu, mobileToggle) {
  const isOpen = navMenu.classList.contains('mobile-open');
  
  if (isOpen) {
    closeMobileMenu(navMenu, mobileToggle);
  } else {
    openMobileMenu(navMenu, mobileToggle);
  }
}

/**
 * Open mobile menu
 */
function openMobileMenu(navMenu, mobileToggle) {
  navMenu.classList.add('mobile-open');
  mobileToggle.classList.add('active');
  mobileToggle.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
}

/**
 * Close mobile menu
 */
function closeMobileMenu(navMenu, mobileToggle) {
  navMenu.classList.remove('mobile-open');
  mobileToggle.classList.remove('active');
  mobileToggle.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

/**
 * Enhance navigation interactions
 */
function enhanceNavigationInteractions() {
  const navLinks = document.querySelectorAll('.nav-link');
  
  navLinks.forEach(link => {
    link.addEventListener('mouseenter', function() {
      if (!link.classList.contains('active')) {
        link.style.transform = 'translateY(-1px)';
      }
    });
    
    link.addEventListener('mouseleave', function() {
      if (!link.classList.contains('active')) {
        link.style.transform = '';
      }
    });
  });
}

/**
 * Handle responsive navigation
 */
function handleNavigationResponsive() {
  let resizeTimer;
  
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
      const mobileToggle = document.querySelector('.mobile-menu-toggle');
      const navMenu = document.querySelector('.nav-menu');
      
      if (window.innerWidth > 768 && navMenu && mobileToggle) {
        closeMobileMenu(navMenu, mobileToggle);
      }
    }, 250);
  });
}

/**
 * ========================================================================
 * AVAILABILITY STATUS
 * Manage employment availability indicator
 * ========================================================================
 */

/**
 * Initialize availability status
 */
function initializeAvailabilityStatus() {
  const statusElement = document.querySelector('.profile-status');
  
  if (!statusElement) return;
  
  if (!SITE_CONFIG.showAvailabilityStatus) {
    statusElement.style.display = 'none';
    return;
  }
  
  updateAvailabilityStatus(statusElement);
}

/**
 * Update availability status
 */
function updateAvailabilityStatus(statusElement) {
  const statusText = statusElement.querySelector('span');
  const statusIcon = statusElement.querySelector('i');
  
  if (SITE_CONFIG.isAvailableForWork) {
    if (statusText) statusText.textContent = SITE_CONFIG.availabilityMessage;
    if (statusIcon) statusIcon.style.color = SITE_CONFIG.availableColor;
    statusElement.style.backgroundColor = SITE_CONFIG.availableColor;
    statusElement.setAttribute('data-available', 'true');
  } else {
    if (statusText) statusText.textContent = SITE_CONFIG.unavailabilityMessage;
    if (statusIcon) statusIcon.style.color = SITE_CONFIG.unavailableColor;
    statusElement.style.backgroundColor = SITE_CONFIG.unavailableColor;
    statusElement.setAttribute('data-available', 'false');
  }
}

/**
 * ========================================================================
 * ANIMATIONS
 * Page animations and effects
 * ========================================================================
 */

/**
 * Initialize animations
 */
function initializeAnimations() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }
  
  initializeScrollAnimations();
  initializeLoadingAnimations();
}

/**
 * Initialize scroll animations
 */
function initializeScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  const animateElements = document.querySelectorAll(
    '.expertise-card, .stat-card, .experience-item, .content-card'
  );
  
  animateElements.forEach(function(element) {
    element.classList.add('animate-on-scroll');
    observer.observe(element);
  });
}

/**
 * Initialize loading animations
 */
function initializeLoadingAnimations() {
  const heroElements = document.querySelectorAll('.hero-text > *');
  
  heroElements.forEach(function(element, index) {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    
    setTimeout(function() {
      element.style.transition = 'all 0.6s ease-out';
      element.style.opacity = '1';
      element.style.transform = 'translateY(0)';
    }, index * 100);
  });
}

/**
 * ========================================================================
 * ERROR HANDLING
 * Global error handling
 * ========================================================================
 */

window.addEventListener('error', function(event) {
  console.error('Global Error:', event.error);
  showNotification('An error occurred. Please refresh the page.', 'error');
});

window.addEventListener('unhandledrejection', function(event) {
  console.error('Unhandled Promise Rejection:', event.reason);
  showNotification('A background process failed.', 'error');
});

/**
 * ========================================================================
 * DEVELOPMENT HELPERS
 * Functions for testing and debugging
 * ========================================================================
 */

// Test notifications
window.testNotifications = function() {
  showNotification('Success message', 'success');
  setTimeout(() => showNotification('Error message', 'error'), 500);
  setTimeout(() => showNotification('Warning message', 'warning'), 1000);
  setTimeout(() => showNotification('Info message', 'info'), 1500);
};

// Debug configuration
SITE_CONFIG.debug = function() {
  console.group('Site Configuration');
  console.log('Availability Status:', this.showAvailabilityStatus);
  console.log('Is Available:', this.isAvailableForWork);
  console.log('PDF Files:', this.pdfFiles);
  console.groupEnd();
};

console.log('Carl Storms Digital Dossier script loaded successfully');
console.log('downloadPDF function available:', typeof window.downloadPDF);