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

   FEATURES:
   ✓ Open / close animation
   ✓ Responsive image sizing
   ✓ Mouse wheel zoom
   ✓ Pinch zoom
   ✓ Double-tap zoom
   ✓ Zoom around cursor / finger
   ✓ Drag image after zoom
   ✓ No dragging at 1x
   ✓ ESC close
   ✓ Overlay close
   ✓ Close button
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
   ZOOM / PAN VARIABLES
============================================================ */

let lightboxScale = 1;

let lightboxTranslateX = 0;
let lightboxTranslateY = 0;

let lastTapTime = 0;

let pinchStartDistance = 0;
let pinchStartScale = 1;

let isLightboxDragging = false;

let dragStartX = 0;
let dragStartY = 0;

let dragStartTranslateX = 0;
let dragStartTranslateY = 0;


/* ============================================================
   GET LIGHTBOX IMAGE SIZE
============================================================ */

function getLightboxSize() {

  if (
    !productImg ||
    !lightboxImg
  ) {
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


  /* ----------------------------------------------------------
     MOBILE
  ---------------------------------------------------------- */

  if (isMobile) {

    maxWidth =
      viewportWidth * 0.85;

    maxHeight =
      viewportHeight * 0.82;

  }


  /* ----------------------------------------------------------
     TABLET
  ---------------------------------------------------------- */

  else if (isTablet) {

    maxWidth =
      viewportWidth * 0.70;

    maxHeight =
      viewportHeight * 0.74;

  }


  /* ----------------------------------------------------------
     DESKTOP
  ---------------------------------------------------------- */

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


  if (
    height >
    maxHeight
  ) {

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
   RESET ZOOM + PAN
============================================================ */

function resetLightboxZoom() {

  lightboxScale = 1;

  lightboxTranslateX = 0;
  lightboxTranslateY = 0;


  if (lightboxImg) {

    lightboxImg.style.transform =
      "translate3d(0, 0, 0) scale(1)";


    lightboxImg.style.transformOrigin =
      "center center";

  }

}


/* ============================================================
   APPLY TRANSFORM
============================================================ */

function applyLightboxTransform() {

  if (!lightboxImg) {
    return;
  }


  lightboxScale =
    Math.max(
      1,
      Math.min(
        lightboxScale,
        4
      )
    );


  lightboxImg.style.transform =
    "translate3d(" +
    lightboxTranslateX +
    "px, " +
    lightboxTranslateY +
    "px, 0) " +
    "scale(" +
    lightboxScale +
    ")";

}


/* ============================================================
   SET ZOOM ORIGIN
   Zoom stays focused on cursor / finger position.
============================================================ */

function setZoomOrigin(
  clientX,
  clientY
) {

  if (!lightboxImg) {
    return;
  }


  const rect =
    lightboxImg.getBoundingClientRect();


  if (
    rect.width <= 0 ||
    rect.height <= 0
  ) {
    return;
  }


  const x =
    (
      (clientX - rect.left) /
      rect.width
    ) * 100;


  const y =
    (
      (clientY - rect.top) /
      rect.height
    ) * 100;


  const safeX =
    Math.max(
      0,
      Math.min(
        100,
        x
      )
    );


  const safeY =
    Math.max(
      0,
      Math.min(
        100,
        y
      )
    );


  lightboxImg.style.transformOrigin =
    safeX +
    "% " +
    safeY +
    "%";

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


  /* ----------------------------------------------------------
     Move lightbox directly into body
  ---------------------------------------------------------- */

  if (
    lightbox.parentElement !==
    document.body
  ) {

    document.body.appendChild(
      lightbox
    );

  }


  /* ----------------------------------------------------------
     RESET ZOOM
  ---------------------------------------------------------- */

  resetLightboxZoom();


  /* ----------------------------------------------------------
     GET ORIGINAL PRODUCT IMAGE POSITION
  ---------------------------------------------------------- */

  const productRect =
    productImg.getBoundingClientRect();


  /* ----------------------------------------------------------
     SET IMAGE SOURCE
  ---------------------------------------------------------- */

  lightboxImg.src =
    productImg.currentSrc ||
    productImg.src;


  lightboxImg.alt =
    productImg.alt ||
    "Expanded Door";


  /* ----------------------------------------------------------
     START POSITION
  ---------------------------------------------------------- */

  lightboxImg.style.position =
    "absolute";


  lightboxImg.style.left =
    productRect.left +
    "px";


  lightboxImg.style.top =
    productRect.top +
    "px";


  lightboxImg.style.width =
    productRect.width +
    "px";


  lightboxImg.style.height =
    productRect.height +
    "px";


  /* ----------------------------------------------------------
     DISABLE TRANSITION FOR STARTING FRAME
  ---------------------------------------------------------- */

  lightboxImg.style.transition =
    "none";


  /* ----------------------------------------------------------
     SHOW LIGHTBOX
  ---------------------------------------------------------- */

  lightbox.classList.add(
    "show"
  );


  document.body.style.overflow =
    "hidden";


  /* ----------------------------------------------------------
     FORCE PAINT
  ---------------------------------------------------------- */

  lightboxImg.offsetHeight;


  /* ----------------------------------------------------------
     ANIMATE TO CENTER
  ---------------------------------------------------------- */

  requestAnimationFrame(
    function () {

      requestAnimationFrame(
        function () {


          lightboxImg.style.transition =
            "left .45s cubic-bezier(.19, 1, .22, 1), " +
            "top .45s cubic-bezier(.19, 1, .22, 1), " +
            "width .45s cubic-bezier(.19, 1, .22, 1), " +
            "height .45s cubic-bezier(.19, 1, .22, 1)";


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
            (
              viewportWidth -
              size.width
            ) / 2;


          const top =
            (
              viewportHeight -
              size.height
            ) / 2;


          lightboxImg.style.left =
            left + "px";


          lightboxImg.style.top =
            top + "px";


          lightboxImg.style.width =
            size.width + "px";


          lightboxImg.style.height =
            size.height + "px";


          resetLightboxZoom();

        }
      );

    }
  );

}


/* ============================================================
   CLOSE LIGHTBOX
============================================================ */

function closeLightbox() {

  if (
    !lightbox ||
    !lightbox.classList.contains(
      "show"
    )
  ) {
    return;
  }


  /* ----------------------------------------------------------
     RESET ZOOM
  ---------------------------------------------------------- */

  resetLightboxZoom();


  /* ----------------------------------------------------------
     GET ORIGINAL IMAGE POSITION
  ---------------------------------------------------------- */

  const productRect =
    productImg.getBoundingClientRect();


  /* ----------------------------------------------------------
     ANIMATE BACK
  ---------------------------------------------------------- */

  lightboxImg.style.left =
    productRect.left +
    "px";


  lightboxImg.style.top =
    productRect.top +
    "px";


  lightboxImg.style.width =
    productRect.width +
    "px";


  lightboxImg.style.height =
    productRect.height +
    "px";


  setTimeout(
    function () {

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


      lightboxImg.style.transform =
        "";


      lightboxImg.style.transformOrigin =
        "";


      lightboxImg.style.cursor =
        "";

    },
    450
  );

}


/* ============================================================
   PRODUCT IMAGE CLICK
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
        event.target ===
        overlay
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
   ESCAPE KEY
============================================================ */

document.addEventListener(
  "keydown",
  function (event) {

    if (
      event.key === "Escape" &&
      lightbox &&
      lightbox.classList.contains(
        "show"
      )
    ) {

      closeLightbox();

    }

  }
);


/* ============================================================
   DESKTOP WHEEL ZOOM
   Zoom around exact cursor position.
============================================================ */

if (lightboxImg) {

  lightboxImg.addEventListener(
    "wheel",
    function (event) {

      if (
        !lightbox ||
        !lightbox.classList.contains(
          "show"
        )
      ) {
        return;
      }


      event.preventDefault();


      /* ------------------------------------------------------
         KEEP CURSOR AS ZOOM CENTER
      ------------------------------------------------------ */

      setZoomOrigin(
        event.clientX,
        event.clientY
      );


      /* ------------------------------------------------------
         ZOOM
      ------------------------------------------------------ */

      if (
        event.deltaY < 0
      ) {

        lightboxScale +=
          0.20;

      } else {

        lightboxScale -=
          0.20;

      }


      /* ------------------------------------------------------
         LIMIT
      ------------------------------------------------------ */

      lightboxScale =
        Math.max(
          1,
          Math.min(
            lightboxScale,
            4
          )
        );


      /* ------------------------------------------------------
         RESET PAN AT 1X
      ------------------------------------------------------ */

      if (
        lightboxScale === 1
      ) {

        lightboxTranslateX = 0;
        lightboxTranslateY = 0;


        lightboxImg.style.transformOrigin =
          "center center";

      }


      applyLightboxTransform();

    },
    {
      passive: false
    }
  );

}


/* ============================================================
   DESKTOP MOUSE DOWN
   Drag only after zoom.
============================================================ */

if (lightboxImg) {

  lightboxImg.addEventListener(
    "mousedown",
    function (event) {

      if (
        lightboxScale <= 1
      ) {
        return;
      }


      isLightboxDragging =
        true;


      dragStartX =
        event.clientX;


      dragStartY =
        event.clientY;


      dragStartTranslateX =
        lightboxTranslateX;


      dragStartTranslateY =
        lightboxTranslateY;


      lightboxImg.style.cursor =
        "grabbing";


      event.preventDefault();

    }
  );

}


/* ============================================================
   DESKTOP MOUSE MOVE
============================================================ */

document.addEventListener(
  "mousemove",
  function (event) {

    if (
      !isLightboxDragging ||
      lightboxScale <= 1
    ) {
      return;
    }


    const moveX =
      event.clientX -
      dragStartX;


    const moveY =
      event.clientY -
      dragStartY;


    lightboxTranslateX =
      dragStartTranslateX +
      moveX;


    lightboxTranslateY =
      dragStartTranslateY +
      moveY;


    applyLightboxTransform();

  }
);


/* ============================================================
   DESKTOP MOUSE UP
============================================================ */

document.addEventListener(
  "mouseup",
  function () {

    if (
      isLightboxDragging
    ) {

      isLightboxDragging =
        false;


      if (lightboxImg) {

        lightboxImg.style.cursor =
          "";

      }

    }

  }
);


/* ============================================================
   TOUCH DISTANCE
============================================================ */

function getTouchDistance(
  touch1,
  touch2
) {

  const dx =
    touch2.clientX -
    touch1.clientX;


  const dy =
    touch2.clientY -
    touch1.clientY;


  return Math.sqrt(
    dx * dx +
    dy * dy
  );

}


/* ============================================================
   TOUCH CENTER
============================================================ */

function getTouchCenter(
  touch1,
  touch2
) {

  return {

    x:
      (
        touch1.clientX +
        touch2.clientX
      ) / 2,


    y:
      (
        touch1.clientY +
        touch2.clientY
      ) / 2

  };

}


/* ============================================================
   MOBILE TOUCH START
============================================================ */

if (lightboxImg) {

  lightboxImg.addEventListener(
    "touchstart",
    function (event) {

      if (
        !lightbox ||
        !lightbox.classList.contains(
          "show"
        )
      ) {
        return;
      }


      /* ------------------------------------------------------
         TWO FINGERS = PINCH
      ------------------------------------------------------ */

      if (
        event.touches.length === 2
      ) {

        pinchStartDistance =
          getTouchDistance(
            event.touches[0],
            event.touches[1]
          );


        pinchStartScale =
          lightboxScale;


        const center =
          getTouchCenter(
            event.touches[0],
            event.touches[1]
          );


        setZoomOrigin(
          center.x,
          center.y
        );


        isLightboxDragging =
          false;


        return;

      }


      /* ------------------------------------------------------
         ONE FINGER
      ------------------------------------------------------ */

      if (
        event.touches.length === 1
      ) {

        const now =
          Date.now();


        /* ----------------------------------------------------
           DOUBLE TAP
        ---------------------------------------------------- */

        if (
          now -
          lastTapTime <
          300
        ) {

          setZoomOrigin(
            event.touches[0].clientX,
            event.touches[0].clientY
          );


          if (
            lightboxScale === 1
          ) {

            lightboxScale =
              2;

          } else {

            resetLightboxZoom();

          }


          applyLightboxTransform();


          lastTapTime =
            0;


          return;

        }


        lastTapTime =
          now;


        /* ----------------------------------------------------
           START DRAG ONLY WHEN ZOOMED
        ---------------------------------------------------- */

        if (
          lightboxScale > 1
        ) {

          isLightboxDragging =
            true;


          dragStartX =
            event.touches[0].clientX;


          dragStartY =
            event.touches[0].clientY;


          dragStartTranslateX =
            lightboxTranslateX;


          dragStartTranslateY =
            lightboxTranslateY;

        }

      }

    },
    {
      passive: false
    }
  );

}


/* ============================================================
   MOBILE TOUCH MOVE
============================================================ */

if (lightboxImg) {

  lightboxImg.addEventListener(
    "touchmove",
    function (event) {

      if (
        !lightbox ||
        !lightbox.classList.contains(
          "show"
        )
      ) {
        return;
      }


      /* ------------------------------------------------------
         PINCH ZOOM
      ------------------------------------------------------ */

      if (
        event.touches.length === 2
      ) {

        event.preventDefault();


        const currentDistance =
          getTouchDistance(
            event.touches[0],
            event.touches[1]
          );


        if (
          pinchStartDistance <= 0
        ) {
          return;
        }


        lightboxScale =
          pinchStartScale *
          (
            currentDistance /
            pinchStartDistance
          );


        lightboxScale =
          Math.max(
            1,
            Math.min(
              lightboxScale,
              4
            )
          );


        const center =
          getTouchCenter(
            event.touches[0],
            event.touches[1]
          );


        setZoomOrigin(
          center.x,
          center.y
        );


        applyLightboxTransform();


        return;

      }


      /* ------------------------------------------------------
         ONE FINGER = PAN
         ONLY AFTER ZOOM
      ------------------------------------------------------ */

      if (
        event.touches.length === 1 &&
        isLightboxDragging &&
        lightboxScale > 1
      ) {

        event.preventDefault();


        const moveX =
          event.touches[0].clientX -
          dragStartX;


        const moveY =
          event.touches[0].clientY -
          dragStartY;


        lightboxTranslateX =
          dragStartTranslateX +
          moveX;


        lightboxTranslateY =
          dragStartTranslateY +
          moveY;


        applyLightboxTransform();

      }

    },
    {
      passive: false
    }
  );

}


/* ============================================================
   TOUCH END
============================================================ */

if (lightboxImg) {

  lightboxImg.addEventListener(
    "touchend",
    function () {

      isLightboxDragging =
        false;


      pinchStartDistance =
        0;


      if (
        lightboxScale <= 1
      ) {

        resetLightboxZoom();

      }

    },
    {
      passive: false
    }
  );

}


/* ============================================================
   TOUCH CANCEL
============================================================ */

if (lightboxImg) {

  lightboxImg.addEventListener(
    "touchcancel",
    function () {

      isLightboxDragging =
        false;


      pinchStartDistance =
        0;

    },
    {
      passive: false
    }
  );

}


/* ============================================================
   MOBILE / TABLET VIEWPORT RESIZE
============================================================ */

function refreshLightboxPosition() {

  if (
    !lightbox ||
    !lightbox.classList.contains(
      "show"
    )
  ) {
    return;
  }


  /*
     Don't disturb the user's
     zoomed/panned position.
  */

  if (
    lightboxScale > 1
  ) {
    return;
  }


  const size =
    getLightboxSize();


  if (!size) {
    return;
  }


  const left =
    (
      lightbox.clientWidth -
      size.width
    ) / 2;


  const top =
    (
      lightbox.clientHeight -
      size.height
    ) / 2;


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

if (
  window.visualViewport
) {

  window.visualViewport.addEventListener(
    "resize",
    function () {

      requestAnimationFrame(
        refreshLightboxPosition
      );

    },
    {
      passive: true
    }
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
