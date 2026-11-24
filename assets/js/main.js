/* Melo Bakes website interactions. Dependency-free and mobile-browser friendly. */
(function () {
  "use strict";

  function ready(callback) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", callback, false);
    else callback();
  }

  ready(function initMeloBakes() {
    var root = document.documentElement;
    if (root.getAttribute("data-melo-js") === "loaded") return;
    root.setAttribute("data-melo-js", "loaded");
    root.classList.add("js-enabled");

    /* Mobile navigation */
    var menuToggle = document.querySelector(".menu-toggle");
    var navigation = document.querySelector(".primary-nav");
    var navLinks = document.querySelectorAll(".primary-nav a");

    function closeNavigation() {
      if (!menuToggle || !navigation) return;
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open navigation");
      navigation.classList.remove("is-open");
    }

    if (menuToggle && navigation) {
      menuToggle.addEventListener("click", function () {
        var isOpen = menuToggle.getAttribute("aria-expanded") === "true";
        menuToggle.setAttribute("aria-expanded", isOpen ? "false" : "true");
        menuToggle.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
        navigation.classList.toggle("is-open", !isOpen);
      }, false);
      for (var n = 0; n < navLinks.length; n += 1) navLinks[n].addEventListener("click", closeNavigation, false);
      document.addEventListener("keydown", function (event) {
        if (event.key === "Escape" || event.keyCode === 27) closeNavigation();
      }, false);
      window.addEventListener("resize", function () {
        if (window.innerWidth >= 769) closeNavigation();
      }, false);
    }

    /* Scroll reveal. Content remains visible if IntersectionObserver is unavailable. */
    var revealItems = document.querySelectorAll(".reveal");
    var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if ("IntersectionObserver" in window && !reduceMotion) {
      var revealObserver = new IntersectionObserver(function (entries, observer) {
        for (var i = 0; i < entries.length; i += 1) {
          if (entries[i].isIntersecting) {
            entries[i].target.classList.add("is-visible");
            observer.unobserve(entries[i].target);
          }
        }
      }, { threshold: 0.08, rootMargin: "0px 0px -7% 0px" });
      for (var r = 0; r < revealItems.length; r += 1) revealObserver.observe(revealItems[r]);
    } else {
      for (var rv = 0; rv < revealItems.length; rv += 1) revealItems[rv].classList.add("is-visible");
    }

    /* Gallery filters */
    var filterButtons = document.querySelectorAll(".filter-button");
    var galleryItems = document.querySelectorAll(".gallery-item");
    for (var f = 0; f < filterButtons.length; f += 1) {
      filterButtons[f].addEventListener("click", function () {
        var selectedButton = this;
        var filter = selectedButton.getAttribute("data-filter") || "all";
        for (var b = 0; b < filterButtons.length; b += 1) {
          var selected = filterButtons[b] === selectedButton;
          filterButtons[b].classList.toggle("is-active", selected);
          filterButtons[b].setAttribute("aria-pressed", selected ? "true" : "false");
        }
        for (var g = 0; g < galleryItems.length; g += 1) {
          galleryItems[g].hidden = !(filter === "all" || galleryItems[g].getAttribute("data-category") === filter);
        }
      }, false);
    }

    /* Group-aware image viewer */
    var lightbox = document.getElementById("lightbox");
    var lightboxImage = lightbox ? lightbox.querySelector(".lightbox-view img") : null;
    var lightboxCaption = lightbox ? lightbox.querySelector(".lightbox-caption") : null;
    var lightboxCounter = lightbox ? lightbox.querySelector(".lightbox-counter") : null;
    var lightboxClose = lightbox ? lightbox.querySelector(".lightbox-close") : null;
    var lightboxPrev = lightbox ? lightbox.querySelector(".lightbox-prev") : null;
    var lightboxNext = lightbox ? lightbox.querySelector(".lightbox-next") : null;
    var lightboxView = lightbox ? lightbox.querySelector(".lightbox-view") : null;
    var activeIndex = 0;
    var activeTriggers = [];
    var touchStartX = null;
    var lastFocusedElement = null;

    function visibleGroupTriggers(group) {
      var all = document.querySelectorAll("[data-lightbox]");
      var matches = [];
      for (var i = 0; i < all.length; i += 1) {
        var trigger = all[i];
        var triggerGroup = trigger.getAttribute("data-lightbox-group") || "default";
        var card = trigger.closest ? trigger.closest(".gallery-item") : null;
        if (triggerGroup === group && (!card || !card.hidden)) matches.push(trigger);
      }
      return matches;
    }

    function preloadAdjacent() {
      if (activeTriggers.length < 2) return;
      var directions = [-1, 1];
      for (var i = 0; i < directions.length; i += 1) {
        var index = (activeIndex + directions[i] + activeTriggers.length) % activeTriggers.length;
        var preload = new Image();
        preload.src = activeTriggers[index].getAttribute("data-lightbox");
      }
    }

    function renderLightbox() {
      if (!lightboxImage || !activeTriggers.length) return;
      var trigger = activeTriggers[activeIndex];
      var imagePath = trigger.getAttribute("data-lightbox");
      var thumb = trigger.querySelector("img");
      var alt = (thumb && thumb.getAttribute("alt")) || trigger.getAttribute("data-caption") || "Melo Bakes photograph";
      lightboxImage.setAttribute("src", imagePath);
      lightboxImage.setAttribute("alt", alt);
      if (lightboxCaption) lightboxCaption.textContent = trigger.getAttribute("data-caption") || alt;
      if (lightboxCounter) lightboxCounter.textContent = (activeIndex + 1) + " / " + activeTriggers.length;
      if (lightboxPrev) lightboxPrev.hidden = activeTriggers.length < 2;
      if (lightboxNext) lightboxNext.hidden = activeTriggers.length < 2;
      preloadAdjacent();
    }

    function openLightbox(trigger) {
      if (!lightbox || !lightboxImage) return;
      activeTriggers = visibleGroupTriggers(trigger.getAttribute("data-lightbox-group") || "default");
      activeIndex = activeTriggers.indexOf(trigger);
      if (activeIndex < 0) activeIndex = 0;
      lastFocusedElement = document.activeElement;
      renderLightbox();
      if (typeof lightbox.showModal === "function") lightbox.showModal();
      else {
        lightbox.setAttribute("open", "open");
        lightbox.classList.add("lightbox-fallback-open");
        document.body.classList.add("lightbox-active");
      }
      if (lightboxClose) lightboxClose.focus();
    }

    function closeLightbox() {
      if (!lightbox) return;
      if (typeof lightbox.close === "function" && lightbox.open) lightbox.close();
      else {
        lightbox.removeAttribute("open");
        lightbox.classList.remove("lightbox-fallback-open");
        document.body.classList.remove("lightbox-active");
      }
      if (lastFocusedElement && typeof lastFocusedElement.focus === "function") lastFocusedElement.focus();
    }

    function moveLightbox(direction) {
      if (!activeTriggers.length) return;
      activeIndex = (activeIndex + direction + activeTriggers.length) % activeTriggers.length;
      renderLightbox();
    }

    var lightboxTriggers = document.querySelectorAll("[data-lightbox]");
    for (var t = 0; t < lightboxTriggers.length; t += 1) {
      lightboxTriggers[t].addEventListener("click", function () { openLightbox(this); }, false);
    }
    if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox, false);
    if (lightboxPrev) lightboxPrev.addEventListener("click", function () { moveLightbox(-1); }, false);
    if (lightboxNext) lightboxNext.addEventListener("click", function () { moveLightbox(1); }, false);
    if (lightbox) {
      lightbox.addEventListener("click", function (event) {
        if (event.target === lightbox) closeLightbox();
      }, false);
      lightbox.addEventListener("keydown", function (event) {
        if (event.key === "ArrowLeft" || event.keyCode === 37) { event.preventDefault(); moveLightbox(-1); }
        else if (event.key === "ArrowRight" || event.keyCode === 39) { event.preventDefault(); moveLightbox(1); }
        else if ((event.key === "Escape" || event.keyCode === 27) && !lightbox.open) closeLightbox();
      }, false);
      lightbox.addEventListener("close", function () {
        if (lastFocusedElement && typeof lastFocusedElement.focus === "function") lastFocusedElement.focus();
      }, false);
    }
    if (lightboxView) {
      lightboxView.addEventListener("touchstart", function (event) {
        if (event.touches && event.touches.length) touchStartX = event.touches[0].clientX;
      }, { passive: true });
      lightboxView.addEventListener("touchend", function (event) {
        if (touchStartX === null || !event.changedTouches || !event.changedTouches.length) return;
        var delta = event.changedTouches[0].clientX - touchStartX;
        touchStartX = null;
        if (Math.abs(delta) > 48) moveLightbox(delta < 0 ? 1 : -1);
      }, { passive: true });
      lightboxView.addEventListener("touchcancel", function () { touchStartX = null; }, { passive: true });
    }

    /* Enquiry form. Add the real business email before publishing. */
    var CONTACT_EMAIL = ""; /* Example: orders@melobakes.co.za */
    var enquiryForm = document.getElementById("enquiry-form");
    var formStatus = document.getElementById("form-status");
    if (enquiryForm) {
      enquiryForm.addEventListener("submit", function (event) {
        event.preventDefault();
        if (!enquiryForm.reportValidity()) return;
        if (!CONTACT_EMAIL || CONTACT_EMAIL.indexOf("@") === -1) {
          if (formStatus) {
            formStatus.textContent = "The form is working, but the Melo Bakes email address still needs to be added in assets/js/main.js before enquiries can be sent.";
            formStatus.classList.add("is-warning");
          }
          return;
        }
        var data = new FormData(enquiryForm);
        var subject = "Melo Bakes enquiry: " + data.get("occasion");
        var body = [
          "Name: " + data.get("name"),
          "Email: " + data.get("email"),
          "Enquiry: " + data.get("occasion"),
          "Event date: " + (data.get("event-date") || "Not specified"),
          "", "Message:", data.get("message")
        ].join("\n");
        window.location.href = "mailto:" + CONTACT_EMAIL + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
        if (formStatus) {
          formStatus.textContent = "Your email app should open with the enquiry prepared. Please send it from there.";
          formStatus.classList.remove("is-warning");
        }
      }, false);
    }

    var year = document.getElementById("current-year");
    if (year) year.textContent = String(new Date().getFullYear());
    if (window.console && window.console.info) window.console.info("Melo Bakes: main.js loaded successfully.");
  });
}());
