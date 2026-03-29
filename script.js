const root = document.documentElement;
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const finePointer = window.matchMedia("(pointer: fine)");

root.classList.add("js-ready");
root.dataset.theme = "dark";

try {
  localStorage.removeItem("theme");
} catch {
  // Ignore storage access issues and keep the site in dark mode.
}

function setupRevealObserver() {
  if (!("IntersectionObserver" in window)) {
    document.querySelectorAll(".reveal").forEach((element) => {
      element.classList.add("is-visible");
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.16,
      rootMargin: "0px 0px -40px 0px",
    }
  );

  document.querySelectorAll(".reveal").forEach((element) => {
    observer.observe(element);
  });
}

function setupParallax() {
  if (prefersReducedMotion.matches) {
    root.style.setProperty("--parallax-x", "0");
    root.style.setProperty("--parallax-y", "0");
    root.style.setProperty("--parallax-scroll", "0");
    return;
  }

  let currentX = 0;
  let currentY = 0;
  let currentScroll = window.scrollY;
  let targetX = 0;
  let targetY = 0;
  let targetScroll = window.scrollY;
  const pointerRange = 16;

  const updateParallax = () => {
    currentX += (targetX - currentX) * 0.08;
    currentY += (targetY - currentY) * 0.08;
    currentScroll += (targetScroll - currentScroll) * 0.08;

    root.style.setProperty("--parallax-x", currentX.toFixed(2));
    root.style.setProperty("--parallax-y", currentY.toFixed(2));
    root.style.setProperty("--parallax-scroll", currentScroll.toFixed(2));

    window.requestAnimationFrame(updateParallax);
  };

  window.addEventListener(
    "pointermove",
    (event) => {
      const xRatio = event.clientX / window.innerWidth - 0.5;
      const yRatio = event.clientY / window.innerHeight - 0.5;
      targetX = xRatio * pointerRange * 2;
      targetY = yRatio * pointerRange * 2;
    },
    { passive: true }
  );

  window.addEventListener(
    "scroll",
    () => {
      targetScroll = window.scrollY;
    },
    { passive: true }
  );

  window.addEventListener(
    "mouseleave",
    () => {
      targetX = 0;
      targetY = 0;
    },
    { passive: true }
  );

  updateParallax();
}

function setupNoiseOverlay() {
  if (prefersReducedMotion.matches || !finePointer.matches) {
    return;
  }

  const canvas = document.createElement("canvas");
  canvas.className = "noise-overlay";
  canvas.setAttribute("aria-hidden", "true");
  document.body.appendChild(canvas);

  const context = canvas.getContext("2d");
  if (!context) {
    canvas.remove();
    return;
  }

  const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };

  const renderNoise = () => {
    if (canvas.width === 0 || canvas.height === 0) {
      return;
    }

    const image = context.createImageData(canvas.width, canvas.height);
    const pixels = image.data;
    const darkTheme = root.dataset.theme !== "light";
    const tint = darkTheme ? [212, 188, 145] : [94, 66, 38];
    const alpha = darkTheme ? 46 : 20;

    for (let index = 0; index < pixels.length; index += 4) {
      if (Math.random() > 0.74) {
        const value = 0.75 + Math.random() * 0.4;
        pixels[index] = Math.min(255, tint[0] * value);
        pixels[index + 1] = Math.min(255, tint[1] * value);
        pixels[index + 2] = Math.min(255, tint[2] * value);
        pixels[index + 3] = alpha;
      }
    }

    context.putImageData(image, 0, 0);
  };

  resize();
  renderNoise();

  const interval = window.setInterval(renderNoise, 100);
  window.addEventListener("resize", () => {
    resize();
    renderNoise();
  });
  window.addEventListener("beforeunload", () => {
    window.clearInterval(interval);
  });
}

function setupCustomCursor() {
  if (prefersReducedMotion.matches || !finePointer.matches) {
    return;
  }

  const cursor = document.createElement("div");
  cursor.className = "site-cursor";
  cursor.setAttribute("aria-hidden", "true");
  cursor.innerHTML = [
    '<div class="site-cursor__orb"></div>',
    '<div class="site-cursor__ring"></div>',
    '<div class="site-cursor__beam"></div>',
  ].join("");

  document.body.appendChild(cursor);
  root.classList.add("has-custom-cursor");

  const state = {
    currentX: window.innerWidth / 2,
    currentY: window.innerHeight / 2,
    targetX: window.innerWidth / 2,
    targetY: window.innerHeight / 2,
    visible: false,
  };

  const textTags = new Set(["P", "SPAN", "LI", "H1", "H2", "H3", "H4", "H5", "H6", "CODE"]);
  const nativeCursorSelector = "video, iframe, input, textarea, select, [data-native-cursor]";

  const applyMode = (target) => {
    if (!(target instanceof Element)) {
      cursor.dataset.mode = "orb";
      root.classList.remove("show-native-cursor");
      return;
    }

    const useNativeCursor = Boolean(target.closest(nativeCursorSelector));
    root.classList.toggle("show-native-cursor", useNativeCursor);

    if (useNativeCursor) {
      cursor.classList.remove("is-visible");
      state.visible = false;
      return;
    }

    const isText = textTags.has(target.tagName);
    const isInteractive = Boolean(
      target.closest("a, button, .surface, .project-card, .detail-card, .timeline-card, .skill-card, .archive-card")
    );

    cursor.dataset.mode = isText ? "beam" : isInteractive ? "pulse" : "orb";
  };

  const render = () => {
    state.currentX += (state.targetX - state.currentX) * 0.2;
    state.currentY += (state.targetY - state.currentY) * 0.2;
    cursor.style.transform = `translate3d(${state.currentX}px, ${state.currentY}px, 0)`;
    window.requestAnimationFrame(render);
  };

  document.addEventListener(
    "pointermove",
    (event) => {
      state.targetX = event.clientX;
      state.targetY = event.clientY;
      state.visible = true;
      cursor.classList.add("is-visible");
      applyMode(event.target);
    },
    { passive: true }
  );

  document.addEventListener(
    "mouseover",
    (event) => {
      applyMode(event.target);
    },
    { passive: true }
  );

  document.addEventListener("pointerdown", () => {
    cursor.classList.add("is-pressed");
  });

  document.addEventListener("pointerup", () => {
    cursor.classList.remove("is-pressed");
  });

  document.documentElement.addEventListener("mouseleave", () => {
    state.visible = false;
    cursor.classList.remove("is-visible");
  });

  window.addEventListener("blur", () => {
    state.visible = false;
    cursor.classList.remove("is-visible");
  });

  render();
}

function measureTextWidth(text, styles) {
  const context = document.createElement("canvas").getContext("2d");
  if (!context) {
    return text.length * 10;
  }

  context.font = [
    styles.fontStyle,
    styles.fontWeight,
    styles.fontSize,
    styles.fontFamily,
  ].join(" ");

  return Math.ceil(context.measureText(text).width);
}

class GlitchLink {
  constructor(element) {
    this.element = element;
    this.originalText = element.textContent.trim();
    this.interval = null;
    this.isGlitching = false;
    this.characters = "!<>[]{}\\/|_-=+*";

    if (!this.originalText) {
      return;
    }

    const styles = window.getComputedStyle(element);
    const width = measureTextWidth(this.originalText, styles);
    this.wrapper = document.createElement("span");
    this.wrapper.className = "glitch-link__wrapper";
    this.wrapper.textContent = this.originalText;
    this.wrapper.style.width = `${Math.max(width + 2, 12)}px`;
    this.wrapper.style.whiteSpace = "nowrap";

    element.textContent = "";
    element.appendChild(this.wrapper);

    element.addEventListener("mouseenter", () => this.start());
    element.addEventListener("mouseleave", () => this.stop());
    element.addEventListener("focus", () => this.start());
    element.addEventListener("blur", () => this.stop());
  }

  start() {
    if (this.isGlitching || !this.wrapper) {
      return;
    }

    this.isGlitching = true;
    let iterations = 0;

    this.interval = window.setInterval(() => {
      this.wrapper.textContent = this.originalText
        .split("")
        .map((character) => {
          if (character === " ") {
            return character;
          }

          return this.characters[Math.floor(Math.random() * this.characters.length)];
        })
        .join("");

      iterations += 1;

      if (iterations >= 4) {
        this.stop();
      }
    }, 60);
  }

  stop() {
    if (this.interval) {
      window.clearInterval(this.interval);
      this.interval = null;
    }

    if (this.wrapper) {
      this.wrapper.textContent = this.originalText;
    }

    this.isGlitching = false;
  }
}

function setupGlitchLinks() {
  if (!finePointer.matches) {
    return;
  }

  const selector = [
    ".nav a",
    ".contact-list a",
    ".project-links a",
    ".button",
    ".breadcrumb",
    ".footer a",
    ".timeline-date a",
  ].join(", ");

  const links = Array.from(document.querySelectorAll(selector));
  links.forEach((link) => {
    if (link.dataset.glitchReady === "true") {
      return;
    }

    link.dataset.glitchReady = "true";
    new GlitchLink(link);
  });
}

function createFocusHint() {
  const hint = document.createElement("div");
  hint.className = "focus-hint";
  hint.setAttribute("aria-hidden", "true");
  hint.innerHTML = [
    '<span class="focus-hint__label">to focus</span>',
    '<span class="focus-hint__keys">',
    '  <span data-key="ArrowUp">Up</span>',
    '  <span data-key="ArrowDown">Down</span>',
    "</span>",
    '<span class="focus-hint__escape" data-key="Escape">Esc</span>',
  ].join("");

  document.body.appendChild(hint);
  return hint;
}

function setupFocusMode() {
  if (prefersReducedMotion.matches || window.innerWidth < 960) {
    return;
  }

  const main = document.querySelector("main");
  const sections = Array.from(main?.querySelectorAll(":scope > section") || []);

  if (sections.length < 2) {
    return;
  }

  const hint = createFocusHint();
  let activeIndex = null;

  const renderState = () => {
    const isActive = activeIndex !== null;
    hint.classList.toggle("is-active", isActive);

    sections.forEach((section, index) => {
      const active = index === activeIndex;
      section.classList.toggle("focus-active", active);
      section.classList.toggle("focus-muted", isActive && !active);
    });
  };

  const flashKey = (key) => {
    const element = hint.querySelector(`[data-key="${key}"]`);
    element?.classList.add("is-pressed");
  };

  const clearKey = (key) => {
    const element = hint.querySelector(`[data-key="${key}"]`);
    element?.classList.remove("is-pressed");
  };

  document.addEventListener("keydown", (event) => {
    if (event.metaKey || event.ctrlKey || event.altKey) {
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      activeIndex = activeIndex === null ? 0 : (activeIndex + 1) % sections.length;
      flashKey(event.key);
      renderState();
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      activeIndex = activeIndex === null ? sections.length - 1 : (activeIndex - 1 + sections.length) % sections.length;
      flashKey(event.key);
      renderState();
    }

    if (event.key === "Escape") {
      activeIndex = null;
      flashKey(event.key);
      renderState();
    }
  });

  document.addEventListener("keyup", (event) => {
    clearKey(event.key);
  });

  document.addEventListener("click", (event) => {
    if (event.target instanceof Element && event.target.closest(".focus-hint")) {
      return;
    }

    if (activeIndex !== null) {
      activeIndex = null;
      renderState();
    }
  });
}

function setupSelectionObserver() {
  let activeElement = null;

  document.addEventListener("selectionchange", () => {
    const selection = window.getSelection();

    if (selection && selection.toString().trim().length > 0 && selection.rangeCount > 0) {
      let node = selection.getRangeAt(0).commonAncestorContainer;
      if (node.nodeType === Node.TEXT_NODE) {
        node = node.parentElement;
      }

      const block = node instanceof Element ? node.closest("section, article, .surface, .hero-copy") : null;

      if (block && block !== activeElement) {
        activeElement?.classList.remove("observation-active");
        activeElement = block;
        activeElement.classList.add("observation-active");
      }

      return;
    }

    activeElement?.classList.remove("observation-active");
    activeElement = null;
  });
}

function setupScreenBoots() {
  const screens = Array.from(document.querySelectorAll("[data-screen-boot]"));

  screens.forEach((screen) => {
    const host = screen.closest("[data-screen-host]") || screen;
    const destination =
      screen.dataset.screenLink ||
      host.querySelector(".button--primary, .link-chip--primary")?.getAttribute("href") ||
      "";
    const autoMode =
      screen.dataset.screenAuto === "scroll" ||
      (screen.dataset.screenAuto !== "manual" && !finePointer.matches);
    let revealTimeout = null;
    let autoRevealObserver = null;
    let hasAutoRevealed = false;

    const reveal = () => {
      window.clearTimeout(revealTimeout);
      screen.classList.remove("is-revealed");

      if (prefersReducedMotion.matches) {
        screen.classList.add("is-revealed");
        return;
      }

      screen.classList.add("is-arming");
      revealTimeout = window.setTimeout(() => {
        screen.classList.remove("is-arming");
        screen.classList.add("is-revealed");
      }, 320);
    };

    const reset = () => {
      window.clearTimeout(revealTimeout);
      screen.classList.remove("is-arming", "is-revealed");
    };

    const openDestination = () => {
      if (!destination) {
        return;
      }

      if (/^https?:\/\//i.test(destination)) {
        window.open(destination, "_blank", "noopener,noreferrer");
        return;
      }

      window.location.href = destination;
    };

    if (autoMode) {
      const playAutoReveal = () => {
        if (hasAutoRevealed) {
          return;
        }

        hasAutoRevealed = true;
        reveal();
        autoRevealObserver?.disconnect();
      };

      if ("IntersectionObserver" in window) {
        autoRevealObserver = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting && entry.intersectionRatio >= 0.35) {
                playAutoReveal();
              }
            });
          },
          {
            threshold: [0.35],
          }
        );

        autoRevealObserver.observe(host);
      } else {
        playAutoReveal();
      }
    } else {
      host.addEventListener("pointerenter", reveal);
      host.addEventListener("pointerleave", reset);
      host.addEventListener("focusin", reveal);
      host.addEventListener("focusout", reset);
    }

    screen.addEventListener("click", openDestination);
    screen.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openDestination();
      }
    });
  });
}

setupRevealObserver();
setupParallax();
setupNoiseOverlay();
setupCustomCursor();
setupGlitchLinks();
setupFocusMode();
setupSelectionObserver();
setupScreenBoots();
