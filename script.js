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

const SVG_NS = "http://www.w3.org/2000/svg";

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffleArray(list) {
  const shuffled = list.slice();

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }

  return shuffled;
}

function distributeCounts(total, definitions) {
  if (definitions.length === 0) {
    return [];
  }

  const minimumCounts = definitions.map(() => 1);
  const remaining = Math.max(0, total - definitions.length);
  const totalWeight = definitions.reduce((sum, definition) => sum + (definition.weight || 1), 0);
  const weighted = definitions.map((definition, index) => {
    const exact = remaining * ((definition.weight || 1) / totalWeight);
    return {
      index,
      count: Math.floor(exact),
      remainder: exact % 1,
    };
  });

  const counts = weighted.map((entry, index) => minimumCounts[index] + entry.count);
  let assigned = counts.reduce((sum, count) => sum + count, 0);

  weighted
    .slice()
    .sort((left, right) => right.remainder - left.remainder)
    .forEach((entry) => {
      if (assigned >= total) {
        return;
      }

      counts[entry.index] += 1;
      assigned += 1;
    });

  return counts;
}

function samplePathPoints(pathData, count) {
  if (count <= 0) {
    return [];
  }

  const svg = document.createElementNS(SVG_NS, "svg");
  svg.setAttribute("viewBox", "0 0 100 100");
  svg.setAttribute("aria-hidden", "true");
  svg.style.position = "absolute";
  svg.style.width = "0";
  svg.style.height = "0";
  svg.style.overflow = "hidden";
  svg.style.pointerEvents = "none";

  const path = document.createElementNS(SVG_NS, "path");
  path.setAttribute("d", pathData);
  svg.appendChild(path);
  document.body.appendChild(svg);

  const length = path.getTotalLength();
  const points = [];

  for (let index = 0; index < count; index += 1) {
    const progress = count === 1 ? 0.5 : index / (count - 1);
    const point = path.getPointAtLength(progress * length);
    points.push({ x: point.x, y: point.y });
  }

  svg.remove();
  return points;
}

function buildShapePoints(definitions, count, width, height, options = {}) {
  const paddingX = options.paddingX || 18;
  const paddingY = options.paddingY || 18;
  const jitterX = options.jitterX || 2.2;
  const jitterY = options.jitterY || 2.2;
  const usableWidth = Math.max(1, width - paddingX * 2);
  const usableHeight = Math.max(1, height - paddingY * 2);
  const counts = distributeCounts(count, definitions);
  const points = [];

  definitions.forEach((definition, index) => {
    samplePathPoints(definition.d, counts[index]).forEach((point) => {
      points.push({
        x: paddingX + (point.x / 100) * usableWidth + (Math.random() - 0.5) * jitterX,
        y: paddingY + (point.y / 100) * usableHeight + (Math.random() - 0.5) * jitterY,
      });
    });
  });

  return shuffleArray(points);
}

function createIdlePoints(side, count, width, height) {
  const margin = 16;
  const centerX = side === "left" ? width * 0.56 : width * 0.44;
  const centerY = height * 0.5;

  return Array.from({ length: count }, () => {
    const angle = Math.random() * Math.PI * 2;
    const radius = Math.pow(Math.random(), 0.72);
    const rangeX = width * (0.18 + Math.random() * 0.22);
    const rangeY = height * (0.2 + Math.random() * 0.24);

    return {
      x: clamp(centerX + Math.cos(angle) * radius * rangeX, margin, width - margin),
      y: clamp(centerY + Math.sin(angle) * radius * rangeY, margin, height - margin),
    };
  });
}

function fitPointCount(points, count, jitterX = 0.9, jitterY = 0.9) {
  if (points.length === 0) {
    return [];
  }

  const source = shuffleArray(points);

  return Array.from({ length: count }, (_, index) => {
    const point = source[index % source.length];
    return {
      x: point.x + (Math.random() - 0.5) * jitterX,
      y: point.y + (Math.random() - 0.5) * jitterY,
    };
  });
}

function buildGlyphPoints(glyph, count, width, height, options = {}) {
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(width));
  canvas.height = Math.max(1, Math.round(height));

  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) {
    return createIdlePoints("left", count, width, height);
  }

  const fontSize = Math.floor(
    Math.min(width * (options.widthScale || 0.84), height * (options.heightScale || 0.84))
  );
  context.clearRect(0, 0, width, height);
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.font = `${fontSize}px "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif`;
  context.fillText(glyph, width / 2 + (options.offsetX || 0), height / 2 + (options.offsetY || 0));

  const image = context.getImageData(0, 0, width, height);
  const fillPoints = [];
  const edgePoints = [];
  const step = options.sampleStep || 4;
  const threshold = options.alphaThreshold || 36;

  const alphaAt = (x, y) => image.data[(y * width + x) * 4 + 3];

  for (let y = 1; y < height - 1; y += step) {
    for (let x = 1; x < width - 1; x += step) {
      const alpha = alphaAt(x, y);

      if (alpha > threshold) {
        fillPoints.push({ x, y });

        if (
          alphaAt(x - 1, y) <= threshold ||
          alphaAt(x + 1, y) <= threshold ||
          alphaAt(x, y - 1) <= threshold ||
          alphaAt(x, y + 1) <= threshold
        ) {
          edgePoints.push({ x, y });
        }
      }
    }
  }

  if (fillPoints.length === 0) {
    return createIdlePoints("left", count, width, height);
  }

  const outlineRatio = clamp(options.outlineRatio || 0.72, 0, 1);
  const outlineCount = Math.round(count * outlineRatio);
  const fillCount = Math.max(0, count - outlineCount);

  return shuffleArray([
    ...fitPointCount(
      edgePoints.length > 0 ? edgePoints : fillPoints,
      outlineCount,
      options.edgeJitterX || 0.45,
      options.edgeJitterY || 0.45
    ),
    ...fitPointCount(fillPoints, fillCount, options.fillJitterX || 0.5, options.fillJitterY || 0.5),
  ]);
}

function createBrainShapePoints(count, width, height) {
  return buildShapePoints(
    [
      {
        d: "M18 55 C10 41 12 25 26 18 C32 10 46 9 55 15 C67 12 79 18 84 30 C91 36 92 50 86 58 C87 71 77 82 64 84 C57 90 44 92 35 87 C22 87 12 77 14 63 C10 60 11 57 18 55 Z",
        weight: 4.2,
      },
      { d: "M33 22 C25 30 24 43 32 53", weight: 1 },
      { d: "M47 18 C40 28 40 42 49 53", weight: 1 },
      { d: "M61 19 C54 28 55 42 63 53", weight: 1 },
      { d: "M73 27 C66 35 66 47 73 57", weight: 0.95 },
      { d: "M26 44 C18 49 18 60 24 68", weight: 0.85 },
      { d: "M76 43 C82 49 82 60 76 67", weight: 0.85 },
      { d: "M39 64 C45 71 54 74 63 71", weight: 1.1 },
      { d: "M46 76 C45 83 43 89 41 95", weight: 0.58 },
      { d: "M54 76 C55 83 57 89 60 95", weight: 0.58 },
    ],
    count,
    width,
    height,
    {
      paddingX: 18,
      paddingY: 18,
      jitterX: 0.65,
      jitterY: 0.72,
    }
  );
}

function createFingerShapePoints(count, width, height) {
  return buildGlyphPoints("👈", count, width, height, {
    widthScale: 0.9,
    heightScale: 0.76,
    offsetX: 4,
    offsetY: 2,
    sampleStep: 4,
    outlineRatio: 0.86,
    edgeJitterX: 0.42,
    edgeJitterY: 0.42,
    fillJitterX: 0.42,
    fillJitterY: 0.42,
  });
}

class MorphingParticleField {
  constructor({ canvas, side, shapeFactory, fill, glow }) {
    this.canvas = canvas;
    this.context = canvas.getContext("2d");
    this.side = side;
    this.shapeFactory = shapeFactory;
    this.fill = fill;
    this.glow = glow;
    this.count = randomInt(side === "left" ? 78 : 74, side === "left" ? 110 : 102);
    this.width = 0;
    this.height = 0;
    this.dpr = 1;
    this.particles = [];
    this.idleTargets = [];
    this.shapeTargets = [];
    this.active = false;
  }

  resize() {
    if (!this.context) {
      return;
    }

    const rect = this.canvas.getBoundingClientRect();
    this.width = Math.round(rect.width);
    this.height = Math.round(rect.height);

    if (this.width === 0 || this.height === 0) {
      return;
    }

    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = Math.round(this.width * this.dpr);
    this.canvas.height = Math.round(this.height * this.dpr);
    this.context.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    this.rebuild();
  }

  rebuild() {
    this.idleTargets = createIdlePoints(this.side, this.count, this.width, this.height);
    this.shapeTargets = this.shapeFactory(this.count, this.width, this.height);
    const startingTargets = this.active ? this.shapeTargets : this.idleTargets;

    this.particles = startingTargets.map((target) => ({
      x: target.x + (Math.random() - 0.5) * 8,
      y: target.y + (Math.random() - 0.5) * 8,
      vx: (Math.random() - 0.5) * 0.9,
      vy: (Math.random() - 0.5) * 0.9,
      radius: 1.7 + Math.random() * 2.6,
      alpha: 0.42 + Math.random() * 0.44,
      speed: 0.55 + Math.random() * 0.8,
      phase: Math.random() * Math.PI * 2,
      driftX: 3.5 + Math.random() * 8,
      driftY: 4.5 + Math.random() * 10,
    }));
  }

  setActive(active) {
    if (this.active === active || this.width === 0 || this.height === 0) {
      return;
    }

    this.active = active;

    if (active) {
      this.shapeTargets = this.shapeFactory(this.count, this.width, this.height);
    } else {
      this.idleTargets = createIdlePoints(this.side, this.count, this.width, this.height);
    }
  }

  render(timestamp) {
    if (!this.context || this.width === 0 || this.height === 0) {
      return;
    }

    const time = timestamp * 0.001;
    const context = this.context;
    const targets = this.active ? this.shapeTargets : this.idleTargets;
    const wobble = this.active ? 0.08 : 1;
    const pull = this.active ? 0.09 : 0.038;
    const drag = this.active ? 0.76 : 0.88;
    const opacity = this.active ? 1 : 0.58;

    context.clearRect(0, 0, this.width, this.height);
    context.save();
    context.globalCompositeOperation = "lighter";
    context.shadowColor = this.glow;
    context.shadowBlur = this.active ? 22 : 10;

    this.particles.forEach((particle, index) => {
      const anchor = targets[index] || { x: this.width / 2, y: this.height / 2 };
      const targetX = anchor.x + Math.sin(time * particle.speed + particle.phase) * particle.driftX * wobble;
      const targetY =
        anchor.y + Math.cos(time * (particle.speed * 0.92) + particle.phase) * particle.driftY * wobble;

      particle.vx += (targetX - particle.x) * pull;
      particle.vy += (targetY - particle.y) * pull;
      particle.vx *= drag;
      particle.vy *= drag;
      particle.x += particle.vx;
      particle.y += particle.vy;

      context.beginPath();
      context.fillStyle = `${this.fill}${(particle.alpha * opacity).toFixed(3)})`;
      context.arc(particle.x, particle.y, particle.radius * (this.active ? 1.2 : 1), 0, Math.PI * 2);
      context.fill();
    });

    context.restore();
  }
}

function setupProjectParticles() {
  if (prefersReducedMotion.matches || !finePointer.matches || window.innerWidth < 1180) {
    return;
  }

  const section = document.querySelector(".section--projects");

  if (!section) {
    return;
  }

  const hosts = Array.from(section.querySelectorAll("[data-screen-host]"));

  if (hosts.length === 0) {
    return;
  }

  const layer = document.createElement("div");
  layer.className = "project-particle-lab";
  layer.setAttribute("aria-hidden", "true");
  layer.innerHTML = [
    '<div class="project-particle-panel project-particle-panel--left">',
    '  <canvas class="project-particle-canvas"></canvas>',
    "</div>",
    '<div class="project-particle-panel project-particle-panel--right">',
    '  <canvas class="project-particle-canvas"></canvas>',
    "</div>",
  ].join("");
  document.body.appendChild(layer);

  const [leftCanvas, rightCanvas] = layer.querySelectorAll(".project-particle-canvas");
  const leftField = new MorphingParticleField({
    canvas: leftCanvas,
    side: "left",
    shapeFactory: createBrainShapePoints,
    fill: "rgba(116, 231, 217, ",
    glow: "rgba(116, 231, 217, 0.34)",
  });
  const rightField = new MorphingParticleField({
    canvas: rightCanvas,
    side: "right",
    shapeFactory: createFingerShapePoints,
    fill: "rgba(246, 223, 190, ",
    glow: "rgba(246, 223, 190, 0.3)",
  });

  const hoveredHosts = new Set();
  const focusedHosts = new Set();

  const syncActiveState = () => {
    const active = hoveredHosts.size > 0 || focusedHosts.size > 0;
    layer.classList.toggle("is-active", active);
    leftField.setActive(active);
    rightField.setActive(active);
  };

  hosts.forEach((host) => {
    host.addEventListener("pointerenter", () => {
      hoveredHosts.add(host);
      syncActiveState();
    });

    host.addEventListener("pointerleave", () => {
      hoveredHosts.delete(host);
      syncActiveState();
    });

    host.addEventListener("focusin", () => {
      focusedHosts.add(host);
      syncActiveState();
    });

    host.addEventListener("focusout", (event) => {
      if (event.relatedTarget instanceof Node && host.contains(event.relatedTarget)) {
        return;
      }

      focusedHosts.delete(host);
      syncActiveState();
    });
  });

  const resizeFields = () => {
    leftField.resize();
    rightField.resize();
  };

  resizeFields();
  window.addEventListener("resize", resizeFields, { passive: true });

  if ("IntersectionObserver" in window) {
    const visibilityObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          layer.classList.toggle("is-visible", entry.isIntersecting);
        });
      },
      {
        threshold: 0.16,
      }
    );

    visibilityObserver.observe(section);
    window.addEventListener(
      "beforeunload",
      () => {
        visibilityObserver.disconnect();
      },
      { once: true }
    );
  } else {
    layer.classList.add("is-visible");
  }

  const render = (timestamp) => {
    leftField.render(timestamp);
    rightField.render(timestamp);
    window.requestAnimationFrame(render);
  };

  window.requestAnimationFrame(render);
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
setupProjectParticles();
setupScreenBoots();
