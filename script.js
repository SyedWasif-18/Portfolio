const loader = document.getElementById("loader");
const menuToggle = document.getElementById("menuToggle");
const themeToggle = document.getElementById("themeToggle");
const typingText = document.getElementById("typingText");
const cursorDot = document.getElementById("cursorDot");
const cursorRing = document.getElementById("cursorRing");
const ambientGlow = document.getElementById("ambientGlow");
const projectSearch = document.getElementById("projectSearch");
const projectCards = Array.from(document.querySelectorAll(".project-card"));
const filterButtons = Array.from(document.querySelectorAll("[data-filter]"));
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");
const testimonialTrack = document.getElementById("testimonialTrack");

window.addEventListener("load", () => {
  window.setTimeout(() => loader.classList.add("hidden"), 450);
});

menuToggle.addEventListener("click", () => {
  document.body.classList.toggle("menu-open");
});

document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => document.body.classList.remove("menu-open"));
});

const savedTheme = localStorage.getItem("theme");
if (savedTheme === "light") {
  document.body.classList.add("light");
}

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light");
  localStorage.setItem("theme", document.body.classList.contains("light") ? "light" : "dark");
});

const roles = ["ECE Undergraduate", "Django Developer", "Python Programmer", "IoT Builder", "ServiceNow Learner"];
let roleIndex = 0;
let charIndex = 0;
let deleting = false;

function typeRole() {
  const role = roles[roleIndex];
  typingText.textContent = role.slice(0, charIndex);

  if (!deleting && charIndex < role.length) {
    charIndex += 1;
    setTimeout(typeRole, 72);
    return;
  }

  if (!deleting && charIndex === role.length) {
    deleting = true;
    setTimeout(typeRole, 1350);
    return;
  }

  if (deleting && charIndex > 0) {
    charIndex -= 1;
    setTimeout(typeRole, 34);
    return;
  }

  deleting = false;
  roleIndex = (roleIndex + 1) % roles.length;
  setTimeout(typeRole, 260);
}

typeRole();

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let ringX = mouseX;
let ringY = mouseY;

window.addEventListener("pointermove", (event) => {
  mouseX = event.clientX;
  mouseY = event.clientY;
  cursorDot.style.left = `${mouseX}px`;
  cursorDot.style.top = `${mouseY}px`;
  ambientGlow.style.left = `${mouseX}px`;
  ambientGlow.style.top = `${mouseY}px`;
});

function animateCursor() {
  ringX += (mouseX - ringX) * 0.18;
  ringY += (mouseY - ringY) * 0.18;
  cursorRing.style.left = `${ringX}px`;
  cursorRing.style.top = `${ringY}px`;
  requestAnimationFrame(animateCursor);
}

animateCursor();

document.querySelectorAll("a, button, input, textarea").forEach((item) => {
  item.addEventListener("mouseenter", () => cursorRing.classList.add("hover"));
  item.addEventListener("mouseleave", () => cursorRing.classList.remove("hover"));
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("visible");

    if (entry.target.classList.contains("skill-card")) {
      const progress = entry.target.querySelector(".progress span");
      progress.style.width = `${entry.target.dataset.level}%`;
    }

    if (entry.target.classList.contains("stat-card")) {
      animateCount(entry.target.querySelector("strong"));
    }

    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.18 });

document.querySelectorAll(".reveal, .stat-card").forEach((element) => revealObserver.observe(element));

function animateCount(element) {
  const target = Number(element.dataset.count || 0);
  const duration = 1200;
  const start = performance.now();

  function frame(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    element.textContent = Math.round(target * eased);
    if (progress < 1) requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
}

let activeFilter = "all";

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    activeFilter = button.dataset.filter;
    filterProjects();
  });
});

projectSearch.addEventListener("input", filterProjects);

function filterProjects() {
  const query = projectSearch.value.trim().toLowerCase();

  projectCards.forEach((card) => {
    const category = card.dataset.category;
    const title = card.dataset.title.toLowerCase();
    const text = card.textContent.toLowerCase();
    const matchesFilter = activeFilter === "all" || category.includes(activeFilter);
    const matchesSearch = !query || title.includes(query) || text.includes(query);
    card.classList.toggle("hidden", !(matchesFilter && matchesSearch));
  });
}

let testimonialIndex = 0;

setInterval(() => {
  const total = testimonialTrack.children.length;
  testimonialIndex = (testimonialIndex + 1) % total;
  testimonialTrack.style.transform = `translateX(-${testimonialIndex * 100}%)`;
}, 4200);

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(contactForm);
  const values = Object.fromEntries(data.entries());
  const invalid = Object.values(values).some((value) => !String(value).trim());
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email || "");

  if (invalid) {
    formStatus.textContent = "Please fill in every field.";
    formStatus.style.color = "var(--danger)";
    return;
  }

  if (!emailValid) {
    formStatus.textContent = "Please enter a valid email address.";
    formStatus.style.color = "var(--danger)";
    return;
  }

  formStatus.textContent = "Message ready. Connect this form to your backend or email service.";
  formStatus.style.color = "var(--green)";
  contactForm.reset();
});

const canvas = document.getElementById("particleCanvas");
const ctx = canvas.getContext("2d");
let particles = [];

function resizeCanvas() {
  const ratio = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * ratio;
  canvas.height = window.innerHeight * ratio;
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  createParticles();
}

function createParticles() {
  const count = Math.min(86, Math.floor(window.innerWidth / 18));
  particles = Array.from({ length: count }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    vx: (Math.random() - 0.5) * 0.28,
    vy: (Math.random() - 0.5) * 0.28,
    r: Math.random() * 1.7 + 0.6
  }));
}

function drawParticles() {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  ctx.fillStyle = "rgba(40, 231, 255, 0.6)";
  ctx.strokeStyle = "rgba(80, 130, 255, 0.13)";

  particles.forEach((particle, index) => {
    particle.x += particle.vx;
    particle.y += particle.vy;

    if (particle.x < 0 || particle.x > window.innerWidth) particle.vx *= -1;
    if (particle.y < 0 || particle.y > window.innerHeight) particle.vy *= -1;

    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
    ctx.fill();

    for (let nextIndex = index + 1; nextIndex < particles.length; nextIndex += 1) {
      const next = particles[nextIndex];
      const dx = particle.x - next.x;
      const dy = particle.y - next.y;
      const distance = Math.hypot(dx, dy);
      if (distance < 130) {
        ctx.globalAlpha = 1 - distance / 130;
        ctx.beginPath();
        ctx.moveTo(particle.x, particle.y);
        ctx.lineTo(next.x, next.y);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
    }
  });

  requestAnimationFrame(drawParticles);
}

resizeCanvas();
drawParticles();
window.addEventListener("resize", resizeCanvas);
