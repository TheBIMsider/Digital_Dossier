// Set current year in footer
document.addEventListener('DOMContentLoaded', () => {
  const yearElements = document.querySelectorAll('#current-year');
  const currentYear = new Date().getFullYear();

  yearElements.forEach((element) => {
    element.textContent = currentYear;
  });

  // Add active class to current page in navigation
  const currentPage = window.location.pathname.split('/').pop();
  const navLinks = document.querySelectorAll('nav a');

  navLinks.forEach((link) => {
    const linkPage = link.getAttribute('href');
    if (
      linkPage === currentPage ||
      (currentPage === '' && linkPage === 'index.html')
    ) {
      link.classList.add('text-primary');
    }
  });
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();

    const targetId = this.getAttribute('href');
    if (targetId === '#') return;

    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  });
});

// Simple form validation for contact forms (if added later)
const forms = document.querySelectorAll('form');
forms.forEach((form) => {
  form.addEventListener('submit', (e) => {
    let valid = true;
    const requiredFields = form.querySelectorAll('[required]');

    requiredFields.forEach((field) => {
      if (!field.value.trim()) {
        valid = false;
        field.classList.add('border-red-500');
      } else {
        field.classList.remove('border-red-500');
      }
    });

    if (!valid) {
      e.preventDefault();
      alert('Please fill in all required fields.');
    }
  });
});

// Add html2pdf.js library
const script = document.createElement('script');
script.src =
  'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
document.head.appendChild(script);

// PDF generation function
async function generatePDF() {
  const paperSize = document.getElementById('paperSize').value;
  const isResume = window.location.pathname.includes('resume');

  // Create descriptive filename with document type, name, and paper size
  const docType = isResume ? 'Resume' : 'CV';
  const filename = `${docType}_Carl_Storms_${paperSize}.pdf`;

  // Configure page size
  const pageSize = paperSize === 'letter' ? [215.9, 279.4] : [210, 297]; // dimensions in mm

  // Show loading state
  const button = document.querySelector('button');
  const originalText = button.innerHTML;
  button.innerHTML =
    '<i class="fas fa-spinner fa-spin mr-2"></i>Generating PDF...';
  button.disabled = true;

  // Get the content and create a clone for PDF generation
  const content = document.querySelector('.pdf-content');
  const pdfContent = content.cloneNode(true);

  // Remove the header controls from the clone
  const headerControls = pdfContent.querySelector('.pdf-header-controls');
  if (headerControls) {
    headerControls.remove();
  }

  // PDF options
  const opt = {
    margin: [10, 10],
    filename: filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: {
      scale: isResume && paperSize === 'letter' ? 1.5 : 2,
      useCORS: true,
      letterRendering: true,
      scrollY: -window.scrollY,
      windowWidth: document.documentElement.clientWidth,
      windowHeight: document.documentElement.clientHeight,
    },
    pagebreak: {
      mode: isResume && paperSize === 'letter' ? 'css' : 'avoid-all',
      before: '.page-break-before',
      after: '.page-break-after',
      avoid:
        isResume && paperSize === 'letter'
          ? ['h3', 'h4', '.skill-tag']
          : ['h1', 'h2', 'h3', 'h4', 'img', '.skill-section'],
    },
    jsPDF: {
      unit: 'mm',
      format: pageSize,
      orientation: 'portrait',
      compress: true,
    },
  };

  try {
    // Generate PDF as a blob
    const pdf = await html2pdf().set(opt).from(pdfContent).output('blob');

    // Create a blob URL
    const blobUrl = URL.createObjectURL(pdf);

    // Create a temporary link and trigger download
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();

    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('There was an error generating the PDF. Please try again.');
  } finally {
    // Restore button state
    button.innerHTML = originalText;
    button.disabled = false;
  }
}
