// Set current year in footer
document.addEventListener("DOMContentLoaded", () => {
  const yearElements = document.querySelectorAll("#current-year")
  const currentYear = new Date().getFullYear()

  yearElements.forEach((element) => {
    element.textContent = currentYear
  })

  // Add active class to current page in navigation
  const currentPage = window.location.pathname.split("/").pop()
  const navLinks = document.querySelectorAll("nav a")

  navLinks.forEach((link) => {
    const linkPage = link.getAttribute("href")
    if (linkPage === currentPage || (currentPage === "" && linkPage === "index.html")) {
      link.classList.add("text-primary")
    }
  })
})

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault()

    const targetId = this.getAttribute("href")
    if (targetId === "#") return

    const targetElement = document.querySelector(targetId)
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  })
})

// Simple form validation for contact forms (if added later)
const forms = document.querySelectorAll("form")
forms.forEach((form) => {
  form.addEventListener("submit", (e) => {
    let valid = true
    const requiredFields = form.querySelectorAll("[required]")

    requiredFields.forEach((field) => {
      if (!field.value.trim()) {
        valid = false
        field.classList.add("border-red-500")
      } else {
        field.classList.remove("border-red-500")
      }
    })

    if (!valid) {
      e.preventDefault()
      alert("Please fill in all required fields.")
    }
  })
})

