// Modern Minimalist Wedding Invitation - Javascript Logic
document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  const openInvitationBtn = document.getElementById("openInvitationBtn");
  const coverSection = document.getElementById("cover");
  const mainContent = document.getElementById("mainContent");
  const saveToCalendarBtn = document.getElementById("saveToCalendar");
  const wishForm = document.getElementById("wishForm");
  const wishList = document.getElementById("wishList");
  const bgMusic = document.getElementById("bgMusic");
  const musicToggle = document.getElementById("musicToggle");

  let isPlaying = false;

  // Invitation Opening Logic
  openInvitationBtn.addEventListener("click", function (e) {
    e.preventDefault();

    this.disabled = true;
    this.style.pointerEvents = "none";
    this.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Membuka...';

    // Play Music
    if (bgMusic) {
      bgMusic.play().then(() => {
        isPlaying = true;
        musicToggle.classList.remove("hidden");
      }).catch(error => {
        console.log("Audio play failed:", error);
      });
    }

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#D4AF37', '#ffffff']
    });

    setTimeout(() => {
      coverSection.classList.add("invitation-opened");
    }, 600);

    setTimeout(() => {
      mainContent.classList.remove("hidden");

      requestAnimationFrame(() => {
        mainContent.classList.add("visible");


        // Trigger animations
        setTimeout(() => {
          document.querySelectorAll(".fade-up-aside").forEach((el, i) => {
            setTimeout(() => el.classList.add("show"), i * 200);
          });
          initScrollAnimation();
        }, 200);
      });

      setTimeout(() => {
        coverSection.style.display = "none";
      }, 1000);
    }, 900);
  });

  // Music Toggle logic
  musicToggle.addEventListener("click", () => {
    if (isPlaying) {
      bgMusic.pause();
      musicToggle.classList.add("paused");
      musicToggle.innerHTML = '<i class="fas fa-play"></i>';
    } else {
      bgMusic.play();
      musicToggle.classList.remove("paused");
      musicToggle.innerHTML = '<i class="fas fa-compact-disc fa-spin-slow"></i>';
    }
    isPlaying = !isPlaying;
  });

  // Wedding date
  const weddingDate = new Date("February 15, 2026 08:00:00").getTime();

  // Countdown Timer
  function updateCountdown() {
    const now = new Date().getTime();
    const timeLeft = weddingDate - now;

    if (timeLeft < 0) {
      document.getElementById("days").innerHTML = "00";
      document.getElementById("hours").innerHTML = "00";
      document.getElementById("minutes").innerHTML = "00";
      document.getElementById("seconds").innerHTML = "00";
      return;
    }

    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    document.getElementById("days").innerHTML = days.toString().padStart(2, "0");
    document.getElementById("hours").innerHTML = hours.toString().padStart(2, "0");
    document.getElementById("minutes").innerHTML = minutes.toString().padStart(2, "0");
    document.getElementById("seconds").innerHTML = seconds.toString().padStart(2, "0");
  }

  setInterval(updateCountdown, 1000);
  updateCountdown();

  // Save to Calendar
  saveToCalendarBtn.addEventListener("click", function () {
    const eventDate = "20260215T080000/20260215T130000";
    const eventTitle = "Pernikahan Putra & Dhilla";
    const eventLocation = "Renjana Titik Kumpul, Jl. Taman Golf Boulevard No.21, Kota Modern, Tangerang";
    const eventDetails = "Undangan pernikahan Putra & Dhilla di Renjana Titik Kumpul. Akad nikah pukul 08.00 WIB, resepsi pukul 10.00 WIB.";

    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&dates=${eventDate}&text=${encodeURIComponent(eventTitle)}&location=${encodeURIComponent(eventLocation)}&details=${encodeURIComponent(eventDetails)}`;

    window.open(calendarUrl, "_blank");
  });

  // RSVP Form Handler
  wishForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const message = document.getElementById("message").value;
    const attendance = document.getElementById("attendance").value;

    let wishes = JSON.parse(localStorage.getItem("weddingWishes") || "[]");

    let attendanceText = attendance === "hadir" ? "Hadir" : (attendance === "mungkin" ? "Mungkin" : "Berhalangan");

    wishes.unshift({
      name,
      attendance: attendanceText,
      message,
      time: "Baru saja"
    });

    localStorage.setItem("weddingWishes", JSON.stringify(wishes));
    renderWishes();
    wishForm.reset();
  });

  // Render wishes
  function renderWishes() {
    wishList.innerHTML = "";
    let wishes = JSON.parse(localStorage.getItem("weddingWishes") || "[]");

    if (wishes.length === 0) {
      wishList.innerHTML = `<p class="text-light italic">Belum ada ucapan</p>`;
      return;
    }

    wishes.forEach((wish) => {
      const wishCard = document.createElement("div");
      wishCard.className = "wish-card";
      wishCard.innerHTML = `
        <div class="wish-card-name">${wish.name} <span class="text-[10px] lowercase font-light opacity-60">• ${wish.attendance}</span></div>
        <p class="wish-card-text">${wish.message}</p>
      `;
      wishList.appendChild(wishCard);
    });
  }

  // Scroll Animation using Intersection Observer
  function initScrollAnimation() {
    const items = document.querySelectorAll(".scroll-anim");
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    items.forEach((item) => observer.observe(item));
  }

  // Set guest name from URL
  function setGuestName() {
    const urlParams = new URLSearchParams(window.location.search);
    const name = urlParams.get("to");
    if (name) {
      document.getElementById("guestName").textContent = decodeURIComponent(name);
    }
  }

  // Initialize Swiper Gallery
  function initGallery() {
    new Swiper(".gallery-swiper", {
      loop: true,
      autoplay: { delay: 3000, disableOnInteraction: false },
      pagination: { el: ".swiper-pagination", clickable: true },
    });
  }

  // Create Falling Petals (Lightweight)
  function initPetals() {
    const container = document.createElement("div");
    container.className = "petals-container";
    document.body.appendChild(container);

    const petalCount = 15; // Small number for performance
    for (let i = 0; i < petalCount; i++) {
      const petal = document.createElement("div");
      petal.className = "petal";

      // Randomize initial state
      const size = Math.random() * 15 + 10;
      const left = Math.random() * 100;
      const duration = Math.random() * 10 + 10;
      const delay = Math.random() * 15;

      petal.style.width = `${size}px`;
      petal.style.height = `${size}px`;
      petal.style.left = `${left}%`;
      petal.style.animationDuration = `${duration}s`;
      petal.style.animationDelay = `-${delay}s`;

      container.appendChild(petal);
    }
  }

  // Init
  setGuestName();
  renderWishes();
  initGallery();
  initPetals();
});
