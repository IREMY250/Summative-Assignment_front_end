// Regex patterns for validation
const nameRegex = /^[a-zA-Z\s]{2,50}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const messageRegex = /^.{10,500}$/;

const contactForm = document.getElementById("contactForm");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const subjectSelect = document.getElementById("subject");
const messageInput = document.getElementById("message");

const nameError = document.getElementById("nameError");
const emailError = document.getElementById("emailError");
const messageError = document.getElementById("messageError");
const successMessage = document.getElementById("successMessage");

// Validation functions
function validateName(value) {
  return nameRegex.test(value.trim());
}

function validateEmail(value) {
  return emailRegex.test(value.trim());
}

function validateMessage(value) {
  return messageRegex.test(value.trim());
}

// Real-time validation
nameInput.addEventListener("blur", function () {
  if (!validateName(this.value)) {
    this.style.borderColor = "#ff3b30";
    nameError.style.display = "block";
  } else {
    this.style.borderColor = "#d2d2d7";
    nameError.style.display = "none";
  }
});

emailInput.addEventListener("blur", function () {
  if (!validateEmail(this.value)) {
    this.style.borderColor = "#ff3b30";
    emailError.style.display = "block";
  } else {
    this.style.borderColor = "#d2d2d7";
    emailError.style.display = "none";
  }
});

messageInput.addEventListener("blur", function () {
  if (!validateMessage(this.value)) {
    this.style.borderColor = "#ff3b30";
    messageError.style.display = "block";
  } else {
    this.style.borderColor = "#d2d2d7";
    messageError.style.display = "none";
  }
});

// Form submission
contactForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const name = nameInput.value;
  const email = emailInput.value;
  const subject = subjectSelect.value;
  const message = messageInput.value;

  let isValid = true;

  if (!validateName(name)) {
    nameInput.style.borderColor = "#ff3b30";
    nameError.style.display = "block";
    isValid = false;
  }

  if (!validateEmail(email)) {
    emailInput.style.borderColor = "#ff3b30";
    emailError.style.display = "block";
    isValid = false;
  }

  if (!validateMessage(message)) {
    messageInput.style.borderColor = "#ff3b30";
    messageError.style.display = "block";
    isValid = false;
  }

  if (!isValid) return;

  // Show success message
  successMessage.style.display = "block";
  contactForm.reset();

  // Hide success message after 5 seconds
  setTimeout(() => {
    successMessage.style.display = "none";
  }, 5000);
});
