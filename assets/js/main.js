"use strict";

/* ===========================
   Header Scroll Effect
=========================== */
const header = document.querySelector(".site-header");
const yearEl = document.querySelector("[data-year]");

if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

if (header) {
  const setScrolled = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  };

  setScrolled();
  window.addEventListener("scroll", setScrolled, { passive: true });
}

// Page loader — never allow a slow image/network request to block the page.
(() => {
  const hideLoader = () => {
    const loader = document.getElementById("page-loader");
    if (!loader) return;

    loader.classList.add("hide");

    window.setTimeout(() => {
      if (loader && loader.parentNode) loader.remove();
    }, 650);
  };

  // Show the page as soon as the HTML/CSS is ready. Images can continue loading.
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", hideLoader, { once: true });
  } else {
    hideLoader();
  }

  // Absolute fallback for slow/offline devices.
  window.setTimeout(hideLoader, 3500);
})();
/* ===========================
   Product Search & Sort
=========================== */
const productGrid = document.querySelector("[data-product-grid]");
const searchInput = document.querySelector("[data-product-search]");
const sortSelect = document.querySelector("[data-product-sort]");

function updateProducts() {
  if (!productGrid) return;

  const query = (searchInput?.value || "").trim().toLowerCase();
  const sortBy = sortSelect?.value || "popular";

  const cards = [...productGrid.querySelectorAll("[data-product-card]")];

  cards.forEach((card) => {
    const name = card.dataset.name || "";
    const material = card.dataset.material || "";

    const visible = `${name} ${material}`.toLowerCase().includes(query);

    card.classList.toggle("d-none", !visible);
  });

  cards
    .sort((a, b) => {
      if (sortBy === "name") {
        return (a.dataset.name || "").localeCompare(b.dataset.name || "");
      }

      return Number(a.dataset.rank || 99) - Number(b.dataset.rank || 99);
    })
    .forEach((card) => productGrid.appendChild(card));
}

searchInput?.addEventListener("input", updateProducts);
sortSelect?.addEventListener("change", updateProducts);

/* ===========================
   Product Thumbnail
=========================== */
document.querySelectorAll("[data-thumb]").forEach((button) => {
  button.addEventListener("click", () => {
    const target = document.querySelector(button.dataset.thumbTarget);
    const image = button.querySelector("img");

    if (!target || !image) return;

    target.src = image.src;
    target.alt = image.alt;
  });
});

/* ===========================
   Bootstrap Offcanvas Fix
=========================== */
document.addEventListener("DOMContentLoaded", () => {

  const offcanvas = document.getElementById("mobileMenu");

  if (offcanvas) {

    offcanvas.addEventListener("hidden.bs.offcanvas", () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    });

  }

});

/* ============================================================
   PREMIUM LIGHTBOX
   UNIVERSAL SMARTPHONE / TABLET / DESKTOP
============================================================ */

const productImg =
  document.getElementById("productImg");

const lightbox =
  document.getElementById("lightbox");

const lightboxImg =
  document.getElementById("lightboxImg");

const overlay =
  document.querySelector(".lightbox-overlay");

const closeBtn =
  document.querySelector(".close-lightbox");


/* ============================================================
   GET IMAGE SIZE
============================================================ */

function getLightboxSize() {

  if (!productImg || !lightboxImg) {
    return null;
  }


  const viewportWidth =
    window.visualViewport
      ? window.visualViewport.width
      : window.innerWidth;

  const viewportHeight =
    window.visualViewport
      ? window.visualViewport.height
      : window.innerHeight;


  const isMobile =
    viewportWidth <= 767;

  const isTablet =
    viewportWidth >= 768 &&
    viewportWidth <= 1199;


  let maxWidth;
  let maxHeight;


  /* MOBILE */

  if (isMobile) {

    maxWidth =
      viewportWidth * 0.85;

    maxHeight =
      viewportHeight * 0.82;

  }


  /* TABLET */

  else if (isTablet) {

    maxWidth =
      viewportWidth * 0.70;

    maxHeight =
      viewportHeight * 0.74;

  }


  /* DESKTOP */

  else {

    maxWidth =
      viewportWidth * 0.85;

    maxHeight =
      viewportHeight * 0.95;

  }


  const naturalWidth =
    productImg.naturalWidth;

  const naturalHeight =
    productImg.naturalHeight;


  let ratio;


  if (
    naturalWidth > 0 &&
    naturalHeight > 0
  ) {

    ratio =
      naturalWidth /
      naturalHeight;

  } else {

    const rect =
      productImg.getBoundingClientRect();

    ratio =
      rect.width /
      rect.height;

  }


  let width =
    maxWidth;

  let height =
    width / ratio;


  if (height > maxHeight) {

    height =
      maxHeight;

    width =
      height * ratio;

  }


  return {
    width,
    height
  };
}


/* ============================================================
   OPEN LIGHTBOX
============================================================ */

function openLightbox() {

  if (
    !productImg ||
    !lightbox ||
    !lightboxImg
  ) {
    return;
  }


  /*
     Put lightbox directly inside body.
  */

  if (
    lightbox.parentElement !==
    document.body
  ) {

    document.body.appendChild(
      lightbox
    );

  }


  const productRect =
    productImg.getBoundingClientRect();


  /*
     Set image.
  */

  lightboxImg.src =
    productImg.currentSrc ||
    productImg.src;

  lightboxImg.alt =
    productImg.alt ||
    "Expanded Door";


  /*
     START POSITION
     Exactly where the product image is.
  */

  lightboxImg.style.position =
    "absolute";

  lightboxImg.style.left =
    productRect.left + "px";

  lightboxImg.style.top =
    productRect.top + "px";

  lightboxImg.style.width =
    productRect.width + "px";

  lightboxImg.style.height =
    productRect.height + "px";


  /*
     Disable animation for the starting frame.
  */

  lightboxImg.style.transition =
    "none";


  /*
     Open overlay.
  */

  lightbox.classList.add("show");

  document.body.style.overflow =
    "hidden";


  /*
     Force browser to paint the starting
     position before animation.
  */

  lightboxImg.offsetHeight;


  requestAnimationFrame(function () {

    requestAnimationFrame(function () {


      /*
         Restore ORIGINAL animation.
      */

      lightboxImg.style.transition =
        "left .45s cubic-bezier(.19, 1, .22, 1), " +
        "top .45s cubic-bezier(.19, 1, .22, 1), " +
        "width .45s cubic-bezier(.19, 1, .22, 1), " +
        "height .45s cubic-bezier(.19, 1, .22, 1)";


      /*
         Calculate final image size.
      */

      const size =
        getLightboxSize();


      if (!size) {
        return;
      }

      const viewportWidth =
        lightbox.clientWidth;

      const viewportHeight =
        lightbox.clientHeight;


      const left =
        (viewportWidth -
          size.width) / 2;


      const top =
        (viewportHeight -
          size.height) / 2;


      /*
         FINAL CENTER
      */

      lightboxImg.style.left =
        left + "px";

      lightboxImg.style.top =
        top + "px";

      lightboxImg.style.width =
        size.width + "px";

      lightboxImg.style.height =
        size.height + "px";

    });

  });

}


/* ============================================================
   CLOSE LIGHTBOX
============================================================ */

function closeLightbox() {

  if (
    !lightbox ||
    !lightbox.classList.contains("show")
  ) {
    return;
  }


  const productRect =
    productImg.getBoundingClientRect();


  /*
     Animate back to original product image.
  */

  lightboxImg.style.left =
    productRect.left + "px";

  lightboxImg.style.top =
    productRect.top + "px";

  lightboxImg.style.width =
    productRect.width + "px";

  lightboxImg.style.height =
    productRect.height + "px";


  setTimeout(function () {

    lightbox.classList.remove(
      "show"
    );

    document.body.style.overflow =
      "";


    lightboxImg.style.left =
      "";

    lightboxImg.style.top =
      "";

    lightboxImg.style.width =
      "";

    lightboxImg.style.height =
      "";

    lightboxImg.style.position =
      "";

  }, 450);

}


/* ============================================================
   PRODUCT IMAGE
============================================================ */

if (productImg) {

  productImg.addEventListener(
    "click",
    openLightbox
  );

}


/* ============================================================
   OVERLAY CLICK
============================================================ */

if (overlay) {

  overlay.addEventListener(
    "click",
    function (event) {

      if (
        event.target === overlay
      ) {

        closeLightbox();

      }

    }
  );

}


/* ============================================================
   CLOSE BUTTON
============================================================ */

if (closeBtn) {

  closeBtn.addEventListener(
    "click",
    function (event) {

      event.preventDefault();
      event.stopPropagation();

      closeLightbox();

    }
  );

}


/* ============================================================
   ESCAPE
============================================================ */

document.addEventListener(
  "keydown",
  function (event) {

    if (
      event.key === "Escape" &&
      lightbox &&
      lightbox.classList.contains("show")
    ) {

      closeLightbox();

    }

  }
);


/* ============================================================
   MOBILE BROWSER RESIZE
============================================================ */

function refreshLightboxPosition() {

  if (
    !lightbox ||
    !lightbox.classList.contains("show")
  ) {
    return;
  }


  const size =
    getLightboxSize();


  if (!size) {
    return;
  }


  /*
     Re-center using the lightbox's
     actual current dimensions.
  */

  const left =
    (lightbox.clientWidth -
      size.width) / 2;

  const top =
    (lightbox.clientHeight -
      size.height) / 2;


  lightboxImg.style.left =
    left + "px";

  lightboxImg.style.top =
    top + "px";

  lightboxImg.style.width =
    size.width + "px";

  lightboxImg.style.height =
    size.height + "px";

}


/* ============================================================
   VISUAL VIEWPORT CHANGES
============================================================ */

if (window.visualViewport) {

  window.visualViewport.addEventListener(
    "resize",
    function () {

      requestAnimationFrame(
        refreshLightboxPosition
      );

    },
    { passive: true }
  );

}
/* ===========================
   Counter Animation
=========================== */

document.addEventListener("DOMContentLoaded", () => {

  const counters = document.querySelectorAll(".gd-counter");

  if (!counters.length) return;

  const animateCounter = (counter) => {

    const target = parseInt(counter.dataset.target);

    const duration = 1000;

    const startTime = performance.now();

    function update(currentTime) {

      const progress = Math.min((currentTime - startTime) / duration, 1);

      counter.textContent = Math.floor(progress * target).toLocaleString();

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        counter.textContent = target.toLocaleString();
      }

    }

    requestAnimationFrame(update);

  };

  const observer = new IntersectionObserver((entries, observer) => {

    entries.forEach((entry) => {

      if (entry.isIntersecting) {

        animateCounter(entry.target);

        observer.unobserve(entry.target);

      }

    });

  }, {
    threshold: 0.5
  });

  counters.forEach(counter => observer.observe(counter));

});

/* ===========================
   Swiper
=========================== */

document.addEventListener("DOMContentLoaded", () => {

  if (typeof Swiper !== "undefined") {

    new Swiper(".mySwiper", {
      loop: true,

      /* ONE FULL SLIDE */
      slidesPerView: 1,
      slidesPerGroup: 1,

      /* NO GAP */
      spaceBetween: 0,

      /* DO NOT CENTER PARTIAL SLIDES */
      centeredSlides: false,

      grabCursor: true,

      speed: 700,

      autoplay: {
        delay: 1500,
        disableOnInteraction: false,
      },

      observer: true,
      observeParents: true,

      on: {
        init: function () {
          this.update();
        },

        resize: function () {
          this.update();
        }
      }
    });

  }

});

const year = document.getElementById("year");

if (year) {
  year.textContent = new Date().getFullYear();
}

// ======================================================
// Image Protection - Discourage Casual Image Downloading
// ======================================================

document.addEventListener("DOMContentLoaded", function () {

  // Disable right-click on images
  document.addEventListener("contextmenu", function (event) {
    if (event.target.closest("img")) {
      event.preventDefault();
    }
  });

  // Disable image dragging
  document.querySelectorAll("img").forEach(function (img) {
    img.setAttribute("draggable", "false");

    img.addEventListener("dragstart", function (event) {
      event.preventDefault();
    });
  });

  // Disable common save shortcuts
  document.addEventListener("keydown", function (event) {

    // Ctrl + S / Command + S
    if ((event.ctrlKey || event.metaKey) &&
      event.key.toLowerCase() === "s") {
      event.preventDefault();
    }

    // Ctrl + Shift + S / Command + Shift + S
    if ((event.ctrlKey || event.metaKey) &&
      event.shiftKey &&
      event.key.toLowerCase() === "s") {
      event.preventDefault();
    }
  });

});

/* ===========================
   Gallery Lightbox
=========================== */
const galleryCards = document.querySelectorAll(".showroom-card");
const galleryLightbox = document.getElementById("showroomLightbox");

if (galleryCards.length && galleryLightbox) {
  const galleryImage = document.getElementById("showroomLightboxImage");
  const galleryTitle = document.getElementById("showroomLightboxTitle");
  const galleryClose = galleryLightbox.querySelector(".showroom-lightbox-close");
  const galleryPrev = galleryLightbox.querySelector(".showroom-lightbox-prev");
  const galleryNext = galleryLightbox.querySelector(".showroom-lightbox-next");

  let galleryIndex = 0;

  function updateGalleryLightbox() {
    const card = galleryCards[galleryIndex];
    galleryImage.src = card.dataset.image;
    galleryImage.alt = card.dataset.title || card.querySelector("img")?.alt || "";
    galleryTitle.textContent = card.dataset.title || "";
  }

  function openGalleryLightbox(index) {
    galleryIndex = index;
    updateGalleryLightbox();
    galleryLightbox.classList.add("show");
    galleryLightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("showroom-lightbox-open");
  }

  function closeGalleryLightbox() {
    galleryLightbox.classList.remove("show");
    galleryLightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("showroom-lightbox-open");
  }

  function nextGalleryImage() {
    galleryIndex = (galleryIndex + 1) % galleryCards.length;
    updateGalleryLightbox();
  }

  function previousGalleryImage() {
    galleryIndex = (galleryIndex - 1 + galleryCards.length) % galleryCards.length;
    updateGalleryLightbox();
  }

  galleryCards.forEach((card, index) => {
    card.addEventListener("click", () => openGalleryLightbox(index));
  });

  galleryClose?.addEventListener("click", closeGalleryLightbox);
  galleryNext?.addEventListener("click", nextGalleryImage);
  galleryPrev?.addEventListener("click", previousGalleryImage);

  galleryLightbox.addEventListener("click", event => {
    if (event.target === galleryLightbox) closeGalleryLightbox();
  });

  document.addEventListener("keydown", event => {
    if (!galleryLightbox.classList.contains("show")) return;

    if (event.key === "Escape") closeGalleryLightbox();
    if (event.key === "ArrowRight") nextGalleryImage();
    if (event.key === "ArrowLeft") previousGalleryImage();
  });
}
