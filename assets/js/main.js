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

  /* ===========================
     Zoom Settings
  =========================== */

  let scale = 1;
  let translateX = 0;
  let translateY = 0;

  const MIN_SCALE = 1;
  const MAX_SCALE = 4;
  const DOUBLE_TAP_SCALE = 2.5;

  /* ===========================
     Interaction Variables
  =========================== */

  let startX = 0;
  let startY = 0;

  let lastX = 0;
  let lastY = 0;

  let isDragging = false;
  let isPinching = false;
  let moved = false;

  let initialDistance = 0;
  let initialScale = 1;

  let lastTapTime = 0;

  /* ===========================
     Update Image Transform
  =========================== */

  function updateImageTransform() {
    galleryImage.style.transform =
      `translate3d(${translateX}px, ${translateY}px, 0) scale(${scale})`;
  }


  /* ===========================
     Reset Zoom
  =========================== */

  function resetGalleryZoom() {
    scale = MIN_SCALE;
    translateX = 0;
    translateY = 0;

    galleryImage.style.transition =
      "transform 0.25s ease";

    updateImageTransform();
  }


  /* ===========================
     Limit Image Movement
  =========================== */

  function limitImagePosition() {
    if (scale <= MIN_SCALE) {
      translateX = 0;
      translateY = 0;
      return;
    }

    /*
      Use the natural displayed image size.
      offsetWidth/offsetHeight do not include
      the current CSS transform.
    */

    const imageWidth =
      galleryImage.offsetWidth;

    const imageHeight =
      galleryImage.offsetHeight;

    const maxX =
      (imageWidth * (scale - 1)) / 2;

    const maxY =
      (imageHeight * (scale - 1)) / 2;

    translateX = Math.max(
      -maxX,
      Math.min(maxX, translateX)
    );

    translateY = Math.max(
      -maxY,
      Math.min(maxY, translateY)
    );
  }


  /* ===========================
     Update Gallery Image
  =========================== */

  function updateGalleryLightbox() {
    const card = galleryCards[galleryIndex];

    resetGalleryZoom();

    galleryImage.src =
      card.dataset.image;

    galleryImage.alt =
      card.dataset.title ||
      card.querySelector("img")?.alt ||
      "";

    if (galleryTitle) {
      galleryTitle.textContent =
        card.dataset.title || "";
    }
  }


  /* ===========================
     Open Lightbox
  =========================== */

  function openGalleryLightbox(index) {
    galleryIndex = index;

    updateGalleryLightbox();

    galleryLightbox.classList.add("show");

    galleryLightbox.setAttribute(
      "aria-hidden",
      "false"
    );

    /*
      Lock scrolling without using
      position: fixed on body.
    */

    document.documentElement.classList.add(
      "showroom-lightbox-open"
    );

    document.body.classList.add(
      "showroom-lightbox-open"
    );
  }


  /* ===========================
     Close Lightbox
  =========================== */

  function closeGalleryLightbox() {
    galleryLightbox.classList.remove("show");

    galleryLightbox.setAttribute(
      "aria-hidden",
      "true"
    );

    /*
      Unlock scrolling
    */

    document.documentElement.classList.remove(
      "showroom-lightbox-open"
    );

    document.body.classList.remove(
      "showroom-lightbox-open"
    );

    resetGalleryZoom();
  }


  /* ===========================
     Next Image
  =========================== */

  function nextGalleryImage() {
    galleryIndex =
      (galleryIndex + 1) %
      galleryCards.length;

    updateGalleryLightbox();
  }


  /* ===========================
     Previous Image
  =========================== */

  function previousGalleryImage() {
    galleryIndex =
      (galleryIndex - 1 + galleryCards.length) %
      galleryCards.length;

    updateGalleryLightbox();
  }


  /* ===========================
     Open Card Image
  =========================== */

  galleryCards.forEach((card, index) => {
    card.addEventListener(
      "click",
      () => {
        openGalleryLightbox(index);
      }
    );
  });


  /* ===========================
     Close / Navigation Buttons
  =========================== */

  galleryClose?.addEventListener(
    "click",
    closeGalleryLightbox
  );

  galleryNext?.addEventListener(
    "click",
    nextGalleryImage
  );

  galleryPrev?.addEventListener(
    "click",
    previousGalleryImage
  );


  /* ===========================
     Click Outside To Close
  =========================== */

  galleryLightbox.addEventListener(
    "click",
    event => {
      if (event.target === galleryLightbox) {
        closeGalleryLightbox();
      }
    }
  );


  /* ===========================
     Keyboard Controls
  =========================== */

  document.addEventListener(
    "keydown",
    event => {
      if (
        !galleryLightbox.classList.contains("show")
      ) {
        return;
      }

      if (event.key === "Escape") {
        closeGalleryLightbox();
        return;
      }

      if (event.key === "ArrowRight") {
        nextGalleryImage();
        return;
      }

      if (event.key === "ArrowLeft") {
        previousGalleryImage();
        return;
      }

      if (
        event.key === "+" ||
        event.key === "="
      ) {
        scale = Math.min(
          MAX_SCALE,
          scale + 0.5
        );

        limitImagePosition();
        updateImageTransform();
        return;
      }

      if (event.key === "-") {
        scale = Math.max(
          MIN_SCALE,
          scale - 0.5
        );

        limitImagePosition();
        updateImageTransform();
      }
    }
  );


  /* ===========================
     Mouse Wheel Zoom
     Desktop
  =========================== */

  galleryImage.addEventListener(
    "wheel",
    event => {
      event.preventDefault();

      const zoomSpeed = 0.15;

      if (event.deltaY < 0) {
        scale += zoomSpeed;
      } else {
        scale -= zoomSpeed;
      }

      scale = Math.max(
        MIN_SCALE,
        Math.min(MAX_SCALE, scale)
      );

      if (scale <= MIN_SCALE) {
        scale = MIN_SCALE;
        translateX = 0;
        translateY = 0;
      }

      limitImagePosition();

      galleryImage.style.transition =
        "transform 0.05s ease";

      updateImageTransform();
    },
    { passive: false }
  );


  /* ===========================
     Desktop Mouse Drag
  =========================== */

  galleryImage.addEventListener(
    "mousedown",
    event => {
      if (scale <= MIN_SCALE) return;

      event.preventDefault();

      isDragging = true;
      moved = false;

      startX = event.clientX;
      startY = event.clientY;

      lastX = translateX;
      lastY = translateY;

      galleryImage.style.transition =
        "none";

      galleryImage.classList.add(
        "is-dragging"
      );
    }
  );


  document.addEventListener(
    "mousemove",
    event => {
      if (!isDragging) return;

      const dx =
        event.clientX - startX;

      const dy =
        event.clientY - startY;

      if (
        Math.abs(dx) > 3 ||
        Math.abs(dy) > 3
      ) {
        moved = true;
      }

      translateX =
        lastX + dx;

      translateY =
        lastY + dy;

      limitImagePosition();
      updateImageTransform();
    }
  );


  document.addEventListener(
    "mouseup",
    () => {
      if (!isDragging) return;

      isDragging = false;

      galleryImage.classList.remove(
        "is-dragging"
      );

      galleryImage.style.transition =
        "transform 0.2s ease";
    }
  );


  /* ===========================
     Desktop Double Click Zoom
  =========================== */

  galleryImage.addEventListener(
    "dblclick",
    event => {
      event.preventDefault();

      if (scale > MIN_SCALE) {
        resetGalleryZoom();
        return;
      }

      scale = DOUBLE_TAP_SCALE;

      translateX = 0;
      translateY = 0;

      galleryImage.style.transition =
        "transform 0.25s ease";

      updateImageTransform();
    }
  );


  /* ===========================
     Touch Start
     Mobile / Tablet
  =========================== */

  galleryImage.addEventListener(
    "touchstart",
    event => {

      /* Pinch Start */

      if (event.touches.length === 2) {
        isPinching = true;
        isDragging = false;

        const touch1 =
          event.touches[0];

        const touch2 =
          event.touches[1];

        initialDistance = Math.hypot(
          touch2.clientX - touch1.clientX,
          touch2.clientY - touch1.clientY
        );

        initialScale = scale;

        galleryImage.style.transition =
          "none";

        return;
      }


      /* Single Touch */

      if (event.touches.length !== 1) return;

      isPinching = false;
      moved = false;

      const touch =
        event.touches[0];

      startX = touch.clientX;
      startY = touch.clientY;

      lastX = translateX;
      lastY = translateY;

      if (scale > MIN_SCALE) {
        isDragging = true;

        galleryImage.style.transition =
          "none";
      } else {
        isDragging = false;
      }
    },
    { passive: true }
  );


  /* ===========================
     Touch Move
     Pinch / Drag
  =========================== */

  galleryImage.addEventListener(
    "touchmove",
    event => {

      /* Pinch Zoom */

      if (
        event.touches.length === 2 &&
        isPinching
      ) {
        event.preventDefault();

        const touch1 =
          event.touches[0];

        const touch2 =
          event.touches[1];

        const currentDistance =
          Math.hypot(
            touch2.clientX -
            touch1.clientX,

            touch2.clientY -
            touch1.clientY
          );

        const zoomRatio =
          currentDistance /
          initialDistance;

        scale =
          initialScale * zoomRatio;

        scale = Math.max(
          MIN_SCALE,
          Math.min(
            MAX_SCALE,
            scale
          )
        );

        if (scale <= MIN_SCALE) {
          scale = MIN_SCALE;
          translateX = 0;
          translateY = 0;
        }

        limitImagePosition();

        galleryImage.style.transition =
          "none";

        updateImageTransform();

        return;
      }


      /* Drag Zoomed Image */

      if (
        event.touches.length === 1 &&
        isDragging &&
        scale > MIN_SCALE
      ) {
        event.preventDefault();

        const touch =
          event.touches[0];

        const dx =
          touch.clientX - startX;

        const dy =
          touch.clientY - startY;

        if (
          Math.abs(dx) > 3 ||
          Math.abs(dy) > 3
        ) {
          moved = true;
        }

        translateX =
          lastX + dx;

        translateY =
          lastY + dy;

        limitImagePosition();
        updateImageTransform();
      }
    },
    { passive: false }
  );


  /* ===========================
     Touch End
     Swipe / Double Tap
  =========================== */

  galleryImage.addEventListener(
    "touchend",
    event => {

      /* End Pinch */

      if (isPinching) {
        isPinching = false;

        if (scale < 1.05) {
          resetGalleryZoom();
        }

        return;
      }

      if (
        !event.changedTouches ||
        !event.changedTouches.length
      ) {
        return;
      }

      const touch =
        event.changedTouches[0];

      const endX =
        touch.clientX;

      const endY =
        touch.clientY;

      const deltaX =
        endX - startX;

      const deltaY =
        endY - startY;

      const SWIPE_DISTANCE = 60;


      /* Swipe Image Navigation
         Only When Not Zoomed */

      if (
        scale <= MIN_SCALE &&
        Math.abs(deltaX) >= SWIPE_DISTANCE &&
        Math.abs(deltaX) >
        Math.abs(deltaY)
      ) {
        if (deltaX < 0) {
          nextGalleryImage();
        } else {
          previousGalleryImage();
        }

        return;
      }


      /* Stop Drag */

      if (isDragging) {
        isDragging = false;

        galleryImage.style.transition =
          "transform 0.2s ease";

        return;
      }


      /* Double Tap Zoom */

      const currentTime =
        Date.now();

      const tapDelay =
        currentTime -
        lastTapTime;

      if (
        tapDelay > 0 &&
        tapDelay < 300 &&
        !moved
      ) {
        if (scale > MIN_SCALE) {
          resetGalleryZoom();
        } else {
          scale = DOUBLE_TAP_SCALE;

          translateX = 0;
          translateY = 0;

          galleryImage.style.transition =
            "transform 0.25s ease";

          updateImageTransform();
        }

        lastTapTime = 0;
      } else {
        lastTapTime =
          currentTime;
      }
    },
    { passive: true }
  );


  /* ===========================
     Touch Cancel
  =========================== */

  galleryImage.addEventListener(
    "touchcancel",
    () => {
      isDragging = false;
      isPinching = false;

      galleryImage.style.transition =
        "transform 0.2s ease";
    },
    { passive: true }
  );


  /* ===========================
     Prevent Browser Image Drag
  =========================== */

  galleryImage.addEventListener(
    "dragstart",
    event => {
      event.preventDefault();
    }
  );
}

