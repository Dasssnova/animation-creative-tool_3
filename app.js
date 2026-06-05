const els = {
  canvas: document.getElementById("preview"),
  previewFrame: document.getElementById("previewFrame"),
  replayAnimationBtn: document.getElementById("replayAnimationBtn"),
  formatBtns: [...document.querySelectorAll(".format-btn")],
  mediaBtns: [...document.querySelectorAll(".media-switch-btn")],
  h1: document.getElementById("h1"),
  h2: document.getElementById("h2"),
  disc: document.getElementById("disc"),
  toggleH2: document.getElementById("toggleH2"),
  h2Section: document.getElementById("h2Section"),
  h2InputStack: document.getElementById("h2InputStack"),
  toggleH2Icon: document.getElementById("toggleH2Icon"),
  toggleDisc: document.getElementById("toggleDisc"),
  toggleQr: document.getElementById("toggleQr"),
  qrToggleVisual: document.querySelector(".qr-toggle"),
  counters: [...document.querySelectorAll(".counter")],
  img1: document.getElementById("img1"),
  img2: document.getElementById("img2"),
  qrFile: document.getElementById("qrFile"),
  err1: document.getElementById("err1"),
  err2: document.getElementById("err2"),
  errQr: document.getElementById("errQr"),
  cardImg1: document.getElementById("cardImg1"),
  cardImg2: document.getElementById("cardImg2"),
  cardQr: document.getElementById("cardQr"),
  delImg1: document.getElementById("delImg1"),
  delImg2: document.getElementById("delImg2"),
  delQr: document.getElementById("delQr"),
  chipImg1: document.getElementById("chipImg1"),
  chipImg2: document.getElementById("chipImg2"),
  exportBtn: document.getElementById("exportBtn"),
  exportBtnSecondary: document.getElementById("exportBtnSecondary"),
  exportNote: document.getElementById("exportNote"),
  controls: document.querySelector(".controls"),
  sceneUi: document.getElementById("sceneUi"),
  sceneUiInner: document.querySelector(".scene-ui-inner"),
  sceneTitle: document.getElementById("sceneTitle"),
  sceneDescription: document.getElementById("sceneDescription"),
  bgRect: document.getElementById("sceneBgRect"),
  bgRect2: document.getElementById("sceneBgRect2"),
  sceneMedia: document.getElementById("sceneMedia"),
  sceneHeroImg: document.getElementById("sceneHeroImg"),
  sceneHeroVideo: document.getElementById("sceneHeroVideo"),
  sceneQrBundle: document.getElementById("sceneQrBundle"),
  sceneQrBundleContent: document.getElementById("sceneQrBundleContent"),
  sceneMediaQr: document.getElementById("sceneMediaQr"),
  sceneHeroImgQr: document.getElementById("sceneHeroImgQr"),
  sceneHeroVideoQr: document.getElementById("sceneHeroVideoQr"),
  sceneQrBox: document.getElementById("sceneQrBox"),
  sceneQrImg: document.getElementById("sceneQrImg"),
  titleMeasurer: document.getElementById("titleMeasurer"),
};

const ctx = els.canvas.getContext("2d");
const state = {
  format: "P10",
  mediaType: "image",
  isPlaying: true,
  rafId: 0,
  startAt: 0,
  elapsedMs: 0,
  lastTs: 0,
  assets: {
    img1: null,
    img2: null,
    qr: null,
  },
  titlePhaseKey: "h1",
  titlePhaseStartMs: 0,
  titleLinesCache: "",
  titleLines: [],
  titleFontReady: false,
  descFontReady: false,
  exporting: false,
};

const P10_TITLE = {
  marginTop: 128,
  marginX: 96,
  blockWidth: 528,
  blockHeight: 440,
  fontSize: 80,
  lineHeight: 1.1,
  maxLines: 5,
  lineDuration: 600,
  firstLineDelay: 300,
  appearWindow: 1000,
  disappearStartMs: 13000,
  h1EarlyDisappearStartMs: 6600,
  h2DisappearStartMs: 13000,
  lineOffsetY: 16,
  lineBlur: 10,
};

const P10_BG_RECT = {
  left: 39,
  top: 171,
  width: 27,
  height: 11,
  color: "#e9e9ff",
  disappearStartMs: 13000,
};

/** P12: заголовок 720×720 — .title-block + .bg-rect (как в макете P12) */
const P12_TITLE = {
  left: 72,
  top: 47,
  blockWidth: 576,
  blockHeight: 198,
  fontSize: 60,
  lineHeight: 1.1,
  maxLines: 5,
  lineDuration: 600,
  firstLineDelay: 300,
  appearWindow: 1000,
  disappearStartMs: 13000,
  h1EarlyDisappearStartMs: 6600,
  h2DisappearStartMs: 13000,
  lineOffsetY: 16,
  lineBlur: 10,
};

const P12_BG_RECT = {
  left: 30,
  top: 81,
  width: 19,
  height: 7,
  color: "#e9e9ff",
};

const P10_MEDIA = {
  // Координаты в пикселях внутреннего canvas (720×1600), не CSS-рамки превью
  width: 552,
  height: 497,
  top: 682,
  left: (720 - 552) / 2,
  appearStartMs: 2000,
  appearDuration: 720,
  disappearStartMs: 12500,
  disappearDuration: 720,
  appearOffsetY: -18,
  blur: 10,
  disappearScale: 0.88,
};

/** P12 без QR: .media 580×270, по центру, top 294px */
const P12_MEDIA = {
  width: 580,
  height: 270,
  top: 294,
  left: (720 - 580) / 2,
  appearStartMs: 2000,
  appearDuration: 720,
  disappearStartMs: 12300,
  disappearDuration: 720,
  appearOffsetY: -18,
  blur: 10,
  disappearScale: 0.88,
};

const P10_QR_MEDIA = {
  width: 540,
  height: 330,
  top: 684,
  left: (720 - 540) / 2,
};

const P10_QR_BOX = {
  width: 245,
  height: 245,
  top: 960,
  left: (720 - 245) / 2,
  borderRadius: 54,
  gradientTop: "#4e5a64",
  gradientBottom: "#2b3541",
  rotateDeg: 8,
  centerX: 360,
  centerY: 1082.5,
};

const P10_QR_CODE = {
  width: 180,
  height: 180,
  top: 992.5,
  left: 360 - 122.5 + 32.5,
  rotateDeg: 8,
  centerX: 360,
  centerY: 1082.5,
};

const P10_QR_BUNDLE = {
  appearStartMs: 2000,
  appearDuration: 720,
  disappearStartMs: 12300,
  disappearDuration: 720,
  appearOffsetY: -18,
  blur: 10,
  disappearScale: 0.88,
};

const P12_QR_MEDIA = {
  width: 400,
  height: 254,
  left: 69,
  top: 290,
};

const P12_QR_BOX = {
  width: 182,
  height: 182,
  top: 312,
  right: 70,
  left: 720 - 70 - 182,
  borderRadius: 40,
  gradientTop: "#4e5a64",
  gradientBottom: "#2b3541",
  rotateDeg: 8,
  centerX: 720 - 70 - 182 + 182 / 2,
  centerY: 312 + 182 / 2,
};

const P12_QR_CODE = {
  width: 133,
  height: 133,
  rotateDeg: 8,
  centerX: 720 - 70 - 182 / 2,
  centerY: 312 + 182 / 2,
};

const P12_QR_BUNDLE = {
  appearStartMs: 2000,
  appearDuration: 720,
  disappearStartMs: 12300,
  disappearDuration: 720,
  appearOffsetY: -18,
  blur: 10,
  disappearScale: 0.88,
};

const TITLE_FONT_SPEC = '600 80px "SB Sans Display", "SB Sans Text", sans-serif';
const P12_TITLE_FONT_SPEC = '600 60px "SB Sans Display", "SB Sans Text", sans-serif';

function getTitleConfig(format = state.format) {
  return format === "P12" ? P12_TITLE : P10_TITLE;
}

function getBgRectConfig(format = state.format) {
  return format === "P12" ? P12_BG_RECT : P10_BG_RECT;
}

function getTitleFontSpec(format = state.format) {
  return format === "P12" ? P12_TITLE_FONT_SPEC : TITLE_FONT_SPEC;
}
const DESC_FONT_SPEC = '500 28px "SB Sans Display", "SB Sans Text", sans-serif';
const P12_DESC_FONT_SPEC = '500 22px "SB Sans Display", "SB Sans Text", sans-serif';

function getDescConfig(format = state.format) {
  return format === "P12" ? P12_DESC : P10_DESC;
}

function getDescFontSpec(format = state.format) {
  return format === "P12" ? P12_DESC_FONT_SPEC : DESC_FONT_SPEC;
}
const DEFAULT_H1_TEXT = "область текстового контента и это максимум строк";
const DEFAULT_H2_TEXT = "второй заголовок и это максимум строк";
const DEFAULT_DISC_TEXT =
  "ПАО Сбербанк. Генеральная лицензия Банка России на осуществление банковских операций\nN° 1481 от 11.08.2015 г.";

const DEFAULT_PREVIEW_IMAGES = {
  img1: { src: "./assets/preview_P10.png", name: "preview_P10.png" },
  img1Qr: { src: "./assets/preview_P10_QR.png", name: "preview_P10_QR.png" },
  img2: { src: "./assets/preview_P12.png", name: "preview_P12.png" },
  img2Qr: { src: "./assets/preview_P12_QR.png", name: "preview_P12_QR.png" },
  // No default QR: keep slot empty until user uploads.
  qr: null,
};

/** P10 + QR: превью-картинка и QR из assets по умолчанию */
const P10_QR_DEFAULT_ASSETS = {
  image: DEFAULT_PREVIEW_IMAGES.img1Qr,
  // No default QR: keep slot empty until user uploads.
  qr: null,
};

const DEFAULT_SLOT_VIDEO = {
  // No default videos: keep slots empty until user uploads.
  img1: null,
  img1Qr: null,
  img2: null,
  img2Qr: null,
};

const P10_DESC = {
  marginX: 32,
  bottom: 48,
  blockHeight: 155,
  fontSize: 28,
  lineHeight: 1.1,
  color: "rgba(233, 233, 255, 0.5)",
  lineDuration: 600,
  lineStepMs: 90,
  appearStartMs: 7000,
  disappearStartMs: 12300,
  lineOffsetY: 16,
  lineBlur: 10,
};

const P12_DESC = {
  marginX: 24,
  bottom: 36,
  blockHeight: 70,
  fontSize: 22,
  lineHeight: 1.1,
  color: "rgba(233, 233, 255, 0.5)",
  lineDuration: 600,
  lineStepMs: 90,
  appearStartMs: 7000,
  disappearStartMs: 12300,
  lineOffsetY: 16,
  lineBlur: 10,
};

const limits = {
  base: { P10: { w: 552, h: 497 }, P12: { w: 580, h: 270 } },
  qr: { P10: { w: 540, h: 330 }, P12: { w: 400, h: 254 } },
};

const previewSizes = {
  P10: { w: 720, h: 1600 },
  P12: { w: 720, h: 720 },
};

const previewLayoutRef = {
  P10: { w: 342, h: 760 },
  P12: { w: 360, h: 360 },
};

function previewPx(value) {
  const ref = previewLayoutRef[state.format];
  return Math.round(value * (els.canvas.width / ref.w));
}

const sceneBackgrounds = {
  P10: { src: "./assets/P10.mp4", video: null },
  P12: { src: "./assets/P12.mp4", video: null },
};

function createSceneBackgroundVideo(src) {
  const video = document.createElement("video");
  video.src = src;
  video.muted = true;
  video.loop = false;
  video.playsInline = true;
  video.addEventListener("ended", () => video.pause());
  video.preload = "auto";
  video.setAttribute("playsinline", "");
  video.style.cssText = "position:fixed;width:0;height:0;opacity:0;pointer-events:none";
  document.body.appendChild(video);
  return video;
}

function initSceneBackgrounds() {
  for (const format of ["P10", "P12"]) {
    const entry = sceneBackgrounds[format];
    entry.video = createSceneBackgroundVideo(entry.src);
  }
}

function getActiveSceneBackground() {
  return sceneBackgrounds[state.format]?.video ?? null;
}

function syncSceneBackgroundPlayback() {
  for (const format of ["P10", "P12"]) {
    const video = sceneBackgrounds[format].video;
    if (!video) continue;
    if (state.isPlaying) {
      if (!video.ended && video.paused && video.readyState >= 1) video.play().catch(() => {});
    } else {
      video.pause();
    }
  }
}

function drawVideoCover(video, w, h) {
  const vw = video.videoWidth;
  const vh = video.videoHeight;
  if (!vw || !vh) return false;
  const scale = Math.max(w / vw, h / vh);
  const dw = vw * scale;
  const dh = vh * scale;
  const dx = (w - dw) / 2;
  const dy = (h - dh) / 2;
  ctx.drawImage(video, dx, dy, dw, dh);
  return true;
}

function seekExportVideo(video, tSec) {
  if (!video || video.readyState < 2) return false;
  const duration =
    Number.isFinite(video.duration) && video.duration > 0 ? video.duration : null;
  let target = Math.max(0, tSec);
  if (duration) {
    target = Math.min(tSec, duration);
    // After the clip ends, keep the last decodable frame (no loop).
    if (target >= duration) target = Math.max(0, duration - 0.04);
  }
  if (Math.abs(video.currentTime - target) > 0.02) {
    video.currentTime = target;
  }
  return true;
}

function getCurrentLimits() {
  return els.toggleQr.checked ? limits.qr : limits.base;
}

function updateCounters() {
  els.counters.forEach((counter) => {
    const id = counter.dataset.for;
    const control = document.getElementById(id);
    if (!control) return;
    counter.textContent = `${control.value.length} / ${control.maxLength}`;
  });
}

function setFileError(el, message = "") {
  el.textContent = message;
  el.hidden = !message;
}

function setCardAsset(card, file, slot, fallbackIcon) {
  const icon = card.querySelector(".card-icon");
  const fileBox = card.querySelector(".card-file");
  const fileName = card.querySelector(".card-file-name");
  const chip = card.querySelector(".chip");
  if (!file) {
    card.classList.remove("has-file");
    card.classList.remove("is-video");
    icon.src = fallbackIcon;
    icon.style.objectFit = "";
    if (fileBox) fileBox.style.display = "none";
    if (fileName) fileName.textContent = "";
    if (chip) {
      if (slot === "img1") chip.textContent = `max ${getCurrentLimits().P10.w} x ${getCurrentLimits().P10.h}`;
      if (slot === "img2") chip.textContent = `max ${getCurrentLimits().P12.w} x ${getCurrentLimits().P12.h}`;
    }
    return;
  }
  card.classList.add("has-file");
  if (chip) {
    if (slot === "img1") chip.textContent = `${getCurrentLimits().P10.w} x ${getCurrentLimits().P10.h}`;
    if (slot === "img2") chip.textContent = `${getCurrentLimits().P12.w} x ${getCurrentLimits().P12.h}`;
  }
  if (file.kind === "video") {
    card.classList.add("is-video");
    icon.src = "./icon/16/video.svg";
    if (fileBox) fileBox.style.display = "flex";
    if (fileName) fileName.textContent = file.file.name;
    return;
  }
  card.classList.remove("is-video");
  if (fileBox) fileBox.style.display = "none";
  if (slot === "qr") {
    icon.src = fallbackIcon;
    icon.style.objectFit = "";
    const typeEl = card.querySelector(".card-type");
    if (typeEl) typeEl.textContent = file.file?.name || "SVG";
    return;
  }
  icon.src = file.previewSrc;
  icon.style.objectFit = "";
}

function captureViewportScroll() {
  return {
    windowY: window.scrollY,
    controlsTop: els.controls?.scrollTop ?? 0,
  };
}

function restoreViewportScroll(saved) {
  window.scrollTo(0, saved?.windowY ?? 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
  if (els.controls) els.controls.scrollTop = saved?.controlsTop ?? 0;
}

function revokeAssetPreviewUrl(asset) {
  if (asset?.objectUrl) {
    URL.revokeObjectURL(asset.objectUrl);
    asset.objectUrl = null;
  }
}

function createHiddenSlotVideo() {
  const video = document.createElement("video");
  video.muted = true;
  video.playsInline = true;
  video.preload = "auto";
  video.setAttribute("playsinline", "");
  video.style.cssText = "position:fixed;width:0;height:0;opacity:0;pointer-events:none";
  document.body.appendChild(video);
  return video;
}

function waitSlotVideoReady(video) {
  return new Promise((resolve, reject) => {
    if (video.readyState >= 2) {
      resolve();
      return;
    }
    video.addEventListener("loadeddata", () => resolve(), { once: true });
    video.addEventListener("error", reject, { once: true });
  });
}

function disposeSlotAsset(slot) {
  const asset = state.assets[slot];
  if (!asset) return;
  revokeAssetPreviewUrl(asset);
  if (asset.kind !== "video" || !asset.video) return;
  asset.video.pause();
  if (asset.ownsVideo) {
    asset.video.remove();
    return;
  }
  if (
    isImg1DomHeroVideo(asset.video) ||
    asset.video === els.sceneHeroVideo ||
    asset.video === els.sceneHeroVideoQr
  ) {
    resetImg1HeroVideoEl(asset.video);
  }
  const other = [els.sceneHeroVideo, els.sceneHeroVideoQr].find(
    (el) => el && el !== asset.video && el.getAttribute("src")
  );
  if (other) resetImg1HeroVideoEl(other);
}

function syncSlotHeroVideoPlayback() {
  for (const slot of ["img1", "img2"]) {
    const asset = state.assets[slot];
    if (asset?.kind !== "video" || !asset.video) continue;
    const video = asset.video;
    const active =
      (state.format === "P10" && slot === "img1" && (isP10MediaNoQr() || isP10QrMode())) ||
      (state.format === "P12" && slot === "img2" && (isP12MediaNoQr() || isP12QrMode()));
    if (!active) {
      video.pause();
      continue;
    }
    const shouldPlay = state.isPlaying && !state.exporting;
    if (shouldPlay) {
      if (!video.ended && video.paused && video.readyState >= 1) video.play().catch(() => {});
    } else {
      video.pause();
    }
  }
}

function clearSlot(slot) {
  disposeSlotAsset(slot);
  state.assets[slot] = null;
  if (slot === "img1") {
    els.img1.value = "";
    setFileError(els.err1);
    setCardAsset(els.cardImg1, null, "img1", "./icon/16/image.svg");
  }
  if (slot === "img2") {
    els.img2.value = "";
    setFileError(els.err2);
    setCardAsset(els.cardImg2, null, "img2", "./icon/16/image.svg");
  }
  if (slot === "qr") {
    els.qrFile.value = "";
    setFileError(els.errQr);
    setCardAsset(els.cardQr, null, "qr", "./icon/16/qr.svg");
    const typeEl = els.cardQr?.querySelector(".card-type");
    if (typeEl) typeEl.textContent = "SVG";
  }
}

function updateChipLimits() {
  const l = getCurrentLimits();
  els.chipImg1.textContent = els.cardImg1.classList.contains("has-file")
    ? `${l.P10.w} x ${l.P10.h}`
    : `max ${l.P10.w} x ${l.P10.h}`;
  els.chipImg2.textContent = els.cardImg2.classList.contains("has-file")
    ? `${l.P12.w} x ${l.P12.h}`
    : `max ${l.P12.w} x ${l.P12.h}`;
  els.chipImg1.classList.toggle("is-accent", els.toggleQr.checked);
  els.chipImg2.classList.toggle("is-accent", els.toggleQr.checked);
}

function updateQrUi() {
  const on = els.toggleQr.checked;
  els.qrToggleVisual.classList.toggle("is-on", on);
  els.cardQr.classList.toggle("is-hidden", !on);
  if (!on) clearSlot("qr");
  updateChipLimits();
}

function ensureAssetFits(slot, limit, errorEl) {
  const asset = state.assets[slot];
  if (!asset || asset.kind === "video") return;
  if (asset.width <= limit.w && asset.height <= limit.h) return;
  clearSlot(slot);
  setFileError(errorEl, `File exceeds limit ${limit.w}x${limit.h}`);
}

function enforceLimitsWithCurrentMode() {
  const l = getCurrentLimits();
  ensureAssetFits("img1", l.P10, els.err1);
  ensureAssetFits("img2", l.P12, els.err2);
}

function updateSceneScale() {
  // Keep scene scale stable regardless of browser resize.
  // Scale is derived from fixed preview layout reference sizes.
  const size = previewSizes[state.format];
  const ref = previewLayoutRef[state.format];
  const scale = ref.w / size.w;
  els.previewFrame.style.setProperty("--scene-scale", String(scale));
}

function applyFormatUi() {
  const formatToggle = document.querySelector(".format-toggle");
  if (formatToggle) formatToggle.setAttribute("data-active", state.format);
  els.formatBtns.forEach((btn) => {
    btn.classList.toggle("is-active", btn.dataset.format === state.format);
  });
  els.previewFrame.classList.toggle("preview-frame--p10", state.format === "P10");
  els.previewFrame.classList.toggle("preview-frame--p12", state.format === "P12");
  const size = previewSizes[state.format];
  els.canvas.width = size.w;
  els.canvas.height = size.h;
  const previewSizeEl = document.getElementById("previewSize");
  if (previewSizeEl) previewSizeEl.textContent = `${size.w} × ${size.h}`;
  if (els.sceneUi) els.sceneUi.hidden = false;
  updateSceneScale();
  resetTitlePhase();
  if (state.format === "P10" && state.assets.img1?.kind === "video") {
    bindImg1HeroVideoToOverlay();
  }
  if (state.format === "P12" && state.assets.img2?.kind === "video") {
    bindImg2HeroVideoToOverlay();
  }
  syncSceneBackgroundPlayback();
}

function applyMediaUi() {
  const mediaSwitch = document.querySelector(".media-switch");
  if (mediaSwitch) mediaSwitch.setAttribute("data-active", state.mediaType);
  els.mediaBtns.forEach((btn) => {
    btn.classList.toggle("is-active", btn.dataset.media === state.mediaType);
  });
  const isVideo = state.mediaType === "video";
  [els.cardImg1, els.cardImg2].forEach((card) => {
    const icon = card.querySelector(".card-icon");
    const type = card.querySelector(".card-type");
    if (icon) icon.src = isVideo ? "./icon/16/video.svg" : "./icon/16/image.svg";
    if (type) type.textContent = isVideo ? "MP4" : "PNG";
  });
  const accept = isVideo ? "video/mp4" : "image/jpeg,image/png";
  els.img1.accept = accept;
  els.img2.accept = accept;
}

function drawBackground() {
  const w = els.canvas.width;
  const h = els.canvas.height;
  const video = getActiveSceneBackground();
  if (state.exporting && video) {
    video.pause();
    if (seekExportVideo(video, state.elapsedMs / 1000) && drawVideoCover(video, w, h)) return;
  } else if (video && state.isPlaying && video.paused && !video.ended) {
    video.play().catch(() => {});
  }
  if (video && video.readyState >= 2 && drawVideoCover(video, w, h)) return;

  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, w, h);
}

function easeTitle(t) {
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  return 1 - (1 - t) ** 2.8;
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function isP10QrMode() {
  return state.format === "P10" && els.toggleQr.checked;
}

function isP10MediaNoQr() {
  return state.format === "P10" && !els.toggleQr.checked;
}

function isP12MediaNoQr() {
  return state.format === "P12" && !els.toggleQr.checked;
}

function isP12QrMode() {
  return state.format === "P12" && els.toggleQr.checked;
}

function getQrBundleConfig(format = state.format) {
  return format === "P12" ? P12_QR_BUNDLE : P10_QR_BUNDLE;
}

function getQrMediaConfig(format = state.format) {
  return format === "P12" ? P12_QR_MEDIA : P10_QR_MEDIA;
}

function getQrBoxConfig(format = state.format) {
  return format === "P12" ? P12_QR_BOX : P10_QR_BOX;
}

function getQrCodeConfig(format = state.format) {
  return format === "P12" ? P12_QR_CODE : P10_QR_CODE;
}

function getQrBundleAnimStyle(tMs, format = state.format) {
  return getLayerAnimStyle(tMs, getQrBundleConfig(format));
}

function getImg2HeroVideoEl() {
  if (isP12QrMode()) return els.sceneHeroVideoQr || els.sceneHeroVideo;
  if (state.format === "P12" && els.sceneHeroVideo) return els.sceneHeroVideo;
  return null;
}

function bindImg2HeroVideoToOverlay() {
  const asset = state.assets.img2;
  const target = getImg2HeroVideoEl();
  if (asset?.kind !== "video" || !asset.previewSrc || !target) return;
  const savedTime = asset.video?.currentTime ?? 0;
  if (asset.video && asset.video !== target && asset.ownsVideo) {
    asset.video.pause();
    asset.video.remove();
  }

  if (target.src !== asset.previewSrc) target.src = asset.previewSrc;
  if (Math.abs(target.currentTime - savedTime) > 0.05) target.currentTime = savedTime;
  asset.video = target;
  asset.ownsVideo = false;
  target.hidden = false;
  target.removeAttribute("hidden");
  target.style.opacity = "1";
}

function getImg1HeroVideoEl() {
  if (isP10QrMode()) return els.sceneHeroVideoQr || els.sceneHeroVideo;
  return els.sceneHeroVideo;
}

function resetImg1HeroVideoEl(el) {
  if (!el) return;
  el.pause();
  el.removeAttribute("src");
  el.load();
  el.hidden = true;
}

function bindImg1HeroVideoToOverlay() {
  const asset = state.assets.img1;
  const target = getImg1HeroVideoEl();
  if (asset?.kind !== "video" || !asset.previewSrc || !target) return;

  const savedTime = asset.video?.currentTime ?? 0;
  if (asset.video && asset.video !== target && asset.ownsVideo) {
    asset.video.pause();
    asset.video.remove();
  }

  const inactive = [els.sceneHeroVideo, els.sceneHeroVideoQr].filter((el) => el && el !== target);
  inactive.forEach(resetImg1HeroVideoEl);

  if (target.src !== asset.previewSrc) target.src = asset.previewSrc;
  if (Math.abs(target.currentTime - savedTime) > 0.05) target.currentTime = savedTime;
  asset.video = target;
  asset.ownsVideo = false;
  target.hidden = false;
  target.removeAttribute("hidden");
  target.style.opacity = "1";
}

function isImg1DomHeroVideo(el) {
  return el === els.sceneHeroVideo || el === els.sceneHeroVideoQr;
}

function getLayerAnimStyle(tMs, opts) {
  if (prefersReducedMotion()) {
    return { opacity: 1, translateY: 0, blur: 0, scale: 1 };
  }

  const {
    appearStartMs,
    appearDuration,
    disappearStartMs,
    disappearDuration,
    appearOffsetY,
    blur,
    disappearScale,
  } = opts;

  if (tMs < appearStartMs) {
    return { opacity: 0, translateY: appearOffsetY, blur, scale: 1 };
  }
  if (tMs < appearStartMs + appearDuration) {
    const p = easeTitle((tMs - appearStartMs) / appearDuration);
    return {
      opacity: p,
      translateY: appearOffsetY * (1 - p),
      blur: blur * (1 - p),
      scale: 1,
    };
  }
  if (tMs < disappearStartMs) {
    return { opacity: 1, translateY: 0, blur: 0, scale: 1 };
  }
  if (tMs < disappearStartMs + disappearDuration) {
    const p = easeTitle((tMs - disappearStartMs) / disappearDuration);
    return {
      opacity: 1 - p,
      translateY: 0,
      blur: blur * p,
      scale: 1 - p * (1 - disappearScale),
    };
  }
  return { opacity: 0, translateY: 0, blur, scale: disappearScale };
}

function getP10MediaAnimStyle(tMs) {
  return getLayerAnimStyle(tMs, P10_MEDIA);
}

function getP12MediaAnimStyle(tMs) {
  return getLayerAnimStyle(tMs, P12_MEDIA);
}

function getP10QrBundleAnimStyle(tMs) {
  return getQrBundleAnimStyle(tMs, "P10");
}

function applyBundleAnimStyles(el, anim) {
  if (!el) return;
  el.style.opacity = String(anim.opacity);
  el.style.transform = `translateY(${anim.translateY}px) scale(${anim.scale})`;
  el.style.filter = `blur(${anim.blur}px)`;
  el.style.transformOrigin = "50% 50%";
}

function drawImageCover(image, dx, dy, dw, dh) {
  const iw = image.width;
  const ih = image.height;
  const scale = Math.max(dw / iw, dh / ih);
  const sw = iw * scale;
  const sh = ih * scale;
  const sx = dx + (dw - sw) / 2;
  const sy = dy + (dh - sh) / 2;
  ctx.drawImage(image, sx, sy, sw, sh);
}

function applyMediaBlockLayout(block, mediaConfig) {
  if (!block) return;
  block.style.position = "absolute";
  block.style.top = `${mediaConfig.top}px`;
  block.style.left = `${mediaConfig.left}px`;
  block.style.width = `${mediaConfig.width}px`;
  block.style.height = `${mediaConfig.height}px`;
  block.style.margin = "0";
  block.style.overflow = "hidden";
  block.style.border = "none";
  block.style.background = "transparent";
  block.style.borderRadius = "0";
  block.style.zIndex = "1";
}

function syncSceneMediaOverlay() {
  if (state.format === "P10") syncP10MediaOverlay();
  else if (state.format === "P12") syncP12MediaOverlay();
  else if (els.sceneMedia) els.sceneMedia.hidden = true;
}

function syncP10MediaOverlay() {
  const block = els.sceneMedia;
  const img = els.sceneHeroImg;
  const video = els.sceneHeroVideo;
  if (!block || !img) return;

  if (state.exporting) {
    block.hidden = true;
    return;
  }

  if (!isP10MediaNoQr()) {
    block.hidden = true;
    return;
  }

  const asset = state.assets.img1;
  if (!asset) {
    block.hidden = true;
    return;
  }

  const isVideo = asset.kind === "video" && asset.previewSrc;
  const isImage = asset.kind !== "video" && asset.previewSrc && asset.image;
  if (!isVideo && !isImage) {
    block.hidden = true;
    return;
  }

  block.hidden = false;
  applyMediaBlockLayout(block, P10_MEDIA);

  const anim = getP10MediaAnimStyle(state.elapsedMs);
  block.style.opacity = String(anim.opacity);
  block.style.transform = `translateY(${anim.translateY}px) scale(${anim.scale})`;
  block.style.filter = `blur(${anim.blur}px)`;
  block.style.transformOrigin = "50% 50%";

  if (isVideo) {
    bindImg1HeroVideoToOverlay();
    img.hidden = true;
    const heroVideo = asset.video;
    if (heroVideo) {
      heroVideo.hidden = false;
      heroVideo.style.opacity = "1";
    }
    [els.sceneHeroVideo, els.sceneHeroVideoQr].forEach((el) => {
      if (el && el !== heroVideo) {
        el.hidden = true;
        el.style.opacity = "0";
      }
    });
  } else {
    if (video) {
      video.hidden = true;
      video.style.opacity = "0";
    }
    resetImg1HeroVideoEl(els.sceneHeroVideoQr);
    img.hidden = false;
    if (img.src !== asset.previewSrc) img.src = asset.previewSrc;
  }
}

function syncP12MediaOverlay() {
  const block = els.sceneMedia;
  const img = els.sceneHeroImg;
  const video = els.sceneHeroVideo;
  if (!block || !img) return;

  if (state.exporting) {
    block.hidden = true;
    return;
  }

  if (!isP12MediaNoQr()) {
    block.hidden = true;
    return;
  }

  const asset = state.assets.img2;
  if (!asset) {
    block.hidden = true;
    return;
  }

  const isVideo = asset.kind === "video" && asset.previewSrc;
  const isImage = asset.kind !== "video" && asset.previewSrc && asset.image;
  if (!isVideo && !isImage) {
    block.hidden = true;
    return;
  }

  block.hidden = false;
  applyMediaBlockLayout(block, P12_MEDIA);

  const anim = getP12MediaAnimStyle(state.elapsedMs);
  block.style.opacity = String(anim.opacity);
  block.style.transform = `translateY(${anim.translateY}px) scale(${anim.scale})`;
  block.style.filter = `blur(${anim.blur}px)`;
  block.style.transformOrigin = "50% 50%";

  if (isVideo) {
    bindImg2HeroVideoToOverlay();
    img.hidden = true;
    if (video) {
      video.hidden = false;
      video.style.opacity = "1";
    }
  } else {
    if (video) {
      video.hidden = true;
      video.style.opacity = "0";
    }
    img.hidden = false;
    if (img.src !== asset.previewSrc) img.src = asset.previewSrc;
  }
}

function drawMediaOnCanvas(asset, mediaConfig, getAnimStyle) {
  if (!asset) return;

  const isVideo = asset.kind === "video" && asset.video;
  const isImage = asset.kind !== "video" && asset.image;
  if (!isVideo && !isImage) return;

  const anim = getAnimStyle(state.elapsedMs);
  const x = mediaConfig.left;
  const y = mediaConfig.top;
  const w = mediaConfig.width;
  const h = mediaConfig.height;
  const cx = x + w / 2;
  const cy = y + h / 2;

  ctx.save();
  ctx.globalAlpha = anim.opacity;
  ctx.filter = `blur(${anim.blur}px)`;
  ctx.translate(cx, cy);
  ctx.scale(anim.scale, anim.scale);
  ctx.translate(-cx, -cy);
  ctx.translate(0, anim.translateY);
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();
  if (isVideo) {
    if (state.exporting) {
      asset.video.pause();
      seekExportVideo(asset.video, state.elapsedMs / 1000);
    }
    const vw = asset.video.videoWidth;
    const vh = asset.video.videoHeight;
    if (vw && vh) {
      const scale = Math.max(w / vw, h / vh);
      const dw = vw * scale;
      const dh = vh * scale;
      const dx = x + (w - dw) / 2;
      const dy = y + (h - dh) / 2;
      ctx.drawImage(asset.video, dx, dy, dw, dh);
    }
  } else {
    drawImageCover(asset.image, x, y, w, h);
  }
  ctx.restore();
}

function drawP10MediaOnCanvas() {
  if (!isP10MediaNoQr()) return;
  drawMediaOnCanvas(state.assets.img1, P10_MEDIA, getP10MediaAnimStyle);
}

function drawP12MediaOnCanvas() {
  if (!isP12MediaNoQr()) return;
  drawMediaOnCanvas(state.assets.img2, P12_MEDIA, getP12MediaAnimStyle);
}

function syncQrBundleOverlay() {
  const bundle = els.sceneQrBundle;
  const content = els.sceneQrBundleContent;
  const media = els.sceneMediaQr;
  const hero = els.sceneHeroImgQr;
  const heroVideo = els.sceneHeroVideoQr;
  const qrImg = els.sceneQrImg;
  if (!bundle || !content) return;

  const onP10 = isP10QrMode();
  const onP12 = isP12QrMode();
  if (state.exporting || (!onP10 && !onP12)) {
    bundle.hidden = true;
    return;
  }

  const imgAsset = onP10 ? state.assets.img1 : state.assets.img2;
  const qrAsset = state.assets.qr;
  const mediaConfig = getQrMediaConfig(state.format);

  if (!imgAsset || !qrAsset?.previewSrc) {
    bundle.hidden = true;
    return;
  }

  const isVideo = imgAsset.kind === "video" && imgAsset.previewSrc;
  const isImage = imgAsset.kind !== "video" && imgAsset.previewSrc && imgAsset.image;
  if (!isVideo && !isImage) {
    bundle.hidden = true;
    return;
  }

  bundle.hidden = false;

  if (isVideo) {
    if (onP10) bindImg1HeroVideoToOverlay();
    else bindImg2HeroVideoToOverlay();
    if (hero) hero.hidden = true;
    if (imgAsset.video) {
      imgAsset.video.hidden = false;
      imgAsset.video.style.opacity = "1";
    }
  } else {
    resetImg1HeroVideoEl(els.sceneHeroVideoQr);
    if (heroVideo) {
      heroVideo.hidden = true;
      heroVideo.style.opacity = "0";
    }
    if (hero) {
      hero.hidden = false;
      if (hero.src !== imgAsset.previewSrc) hero.src = imgAsset.previewSrc;
    }
  }

  if (qrImg) {
    if (qrImg.src !== qrAsset.previewSrc) qrImg.src = qrAsset.previewSrc;
    if (state.format === "P12") {
      qrImg.width = P12_QR_CODE.width;
      qrImg.height = P12_QR_CODE.height;
    }
  }

  applyBundleAnimStyles(content, getQrBundleAnimStyle(state.elapsedMs, state.format));

  if (media) {
    media.style.position = "absolute";
    media.style.top = `${mediaConfig.top}px`;
    media.style.left = `${mediaConfig.left}px`;
    media.style.width = `${mediaConfig.width}px`;
    media.style.height = `${mediaConfig.height}px`;
    media.style.margin = "0";
    media.style.overflow = "hidden";
    media.style.border = "none";
    media.style.background = "transparent";
    media.style.borderRadius = "0";
    media.style.opacity = "1";
    media.style.transform = "none";
    media.style.filter = "none";
  }
}

function drawImageContain(image, x, y, w, h) {
  const iw = image.width;
  const ih = image.height;
  if (!iw || !ih) return;
  const scale = Math.min(w / iw, h / ih);
  const dw = iw * scale;
  const dh = ih * scale;
  const dx = x + (w - dw) / 2;
  const dy = y + (h - dh) / 2;
  ctx.drawImage(image, dx, dy, dw, dh);
}

function drawRoundedGradientRect(x, y, w, h, radius, topColor, bottomColor) {
  const r = Math.min(radius, w / 2, h / 2);
  const grad = ctx.createLinearGradient(x, y, x, y + h);
  grad.addColorStop(0, topColor);
  grad.addColorStop(1, bottomColor);
  ctx.fillStyle = grad;
  ctx.beginPath();
  if (typeof ctx.roundRect === "function") {
    ctx.roundRect(x, y, w, h, r);
  } else {
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }
  ctx.fill();
}

function drawQrBundleOnCanvas() {
  const onP10 = isP10QrMode();
  const onP12 = isP12QrMode();
  if (!onP10 && !onP12) return;

  const imgAsset = onP10 ? state.assets.img1 : state.assets.img2;
  const qrAsset = state.assets.qr;
  if (!imgAsset || !qrAsset?.image) return;

  const isVideo = imgAsset.kind === "video" && imgAsset.video;
  const isImage = imgAsset.kind !== "video" && imgAsset.image;
  if (!isVideo && !isImage) return;

  const mediaConfig = getQrMediaConfig(state.format);
  const boxConfig = getQrBoxConfig(state.format);
  const codeConfig = getQrCodeConfig(state.format);
  const anim = getQrBundleAnimStyle(state.elapsedMs, state.format);
  const pivotX = boxConfig.centerX;
  const pivotY = boxConfig.centerY;

  ctx.save();
  ctx.globalAlpha = anim.opacity;
  ctx.filter = `blur(${anim.blur}px)`;
  ctx.translate(pivotX, pivotY);
  ctx.scale(anim.scale, anim.scale);
  ctx.translate(-pivotX, -pivotY);
  ctx.translate(0, anim.translateY);

  const mx = mediaConfig.left;
  const my = mediaConfig.top;
  const mw = mediaConfig.width;
  const mh = mediaConfig.height;
  ctx.save();
  ctx.beginPath();
  ctx.rect(mx, my, mw, mh);
  ctx.clip();
  if (isVideo) {
    if (state.exporting) {
      imgAsset.video.pause();
      seekExportVideo(imgAsset.video, state.elapsedMs / 1000);
    }
    const vw = imgAsset.video.videoWidth;
    const vh = imgAsset.video.videoHeight;
    if (vw && vh) {
      const scale = Math.max(mw / vw, mh / vh);
      const dw = vw * scale;
      const dh = vh * scale;
      const dx = mx + (mw - dw) / 2;
      const dy = my + (mh - dh) / 2;
      ctx.drawImage(imgAsset.video, dx, dy, dw, dh);
    }
  } else {
    drawImageCover(imgAsset.image, mx, my, mw, mh);
  }
  ctx.restore();

  const rot = (boxConfig.rotateDeg * Math.PI) / 180;
  ctx.save();
  ctx.translate(boxConfig.centerX, boxConfig.centerY);
  ctx.rotate(rot);
  drawRoundedGradientRect(
    -boxConfig.width / 2,
    -boxConfig.height / 2,
    boxConfig.width,
    boxConfig.height,
    boxConfig.borderRadius,
    boxConfig.gradientTop,
    boxConfig.gradientBottom
  );
  drawImageContain(
    qrAsset.image,
    -codeConfig.width / 2,
    -codeConfig.height / 2,
    codeConfig.width,
    codeConfig.height
  );
  ctx.restore();

  ctx.restore();
}

function getH1DisappearStartMs(titleConfig = getTitleConfig()) {
  if (els.toggleH2.checked) {
    return titleConfig.h1EarlyDisappearStartMs ?? titleConfig.disappearStartMs;
  }
  return titleConfig.disappearStartMs;
}

function getH1FullyGoneMs(titleConfig = getTitleConfig()) {
  // Moment when the last H1 line has fully disappeared.
  // The first (top) line disappears last (it disappears at disappearStartMs,
  // the bottom lines disappear earlier in reverse order).
  return getH1DisappearStartMs(titleConfig) + titleConfig.lineDuration;
}

function getP10TitlePhaseKey() {
  const titleConfig = getTitleConfig();
  const showH2 = els.toggleH2.checked && state.elapsedMs >= getH1FullyGoneMs(titleConfig);
  return showH2 ? "h2" : "h1";
}

function getP10TitleText(key) {
  return key === "h2" ? els.h2.value || "Heading 2" : els.h1.value || "Heading 1";
}

function configureTitleMeasurer(titleConfig = getTitleConfig()) {
  const measurer = els.titleMeasurer;
  if (!measurer) return;
  measurer.style.width = `${titleConfig.blockWidth}px`;
  measurer.style.fontSize = `${titleConfig.fontSize}px`;
}

function wrapTitleWords(words, maxLines, linesOut, blockWidth) {
  const measurer = els.titleMeasurer;
  if (!measurer) {
    if (words.length && linesOut.length < maxLines) linesOut.push(words.join(" "));
    return;
  }

  let current = "";
  const fits = (line) => {
    measurer.textContent = line;
    return measurer.scrollWidth <= blockWidth;
  };

  for (const word of words) {
    if (linesOut.length >= maxLines) return;
    const next = current ? `${current} ${word}` : word;
    if (current && !fits(next)) {
      linesOut.push(current);
      current = word;
    } else if (!current && !fits(word)) {
      linesOut.push(word);
      current = "";
    } else {
      current = next;
    }
  }

  if (linesOut.length < maxLines && current) linesOut.push(current);
}

function splitTitleToLines(text, maxLines, titleConfig = getTitleConfig()) {
  configureTitleMeasurer(titleConfig);
  const lineLimit = maxLines ?? titleConfig.maxLines;
  const trimmed = text.trim();
  if (!trimmed) return [""];

  const lines = [];
  const paragraphs = trimmed.split(/\n/);

  for (const paragraph of paragraphs) {
    if (lines.length >= lineLimit) break;
    const words = paragraph.trim().split(/\s+/).filter(Boolean);
    if (!words.length) continue;
    wrapTitleWords(words, lineLimit, lines, titleConfig.blockWidth);
  }

  return lines.length ? lines.slice(0, lineLimit) : [""];
}

function getTitleLineStepMs(lineCount, titleConfig = getTitleConfig()) {
  if (lineCount <= 1) return 0;
  return (titleConfig.appearWindow - titleConfig.firstLineDelay) / (lineCount - 1);
}

function getTitleLineDelay(lineIndex, lineCount, titleConfig = getTitleConfig()) {
  return titleConfig.firstLineDelay + getTitleLineStepMs(lineCount, titleConfig) * lineIndex;
}

/** Исчезновение .bg-rect синхронно с первой (верхней) строкой заголовка */
function getBgRectDisappearStartMs(titleLineCount, titleConfig = getTitleConfig()) {
  const n = Math.max(1, titleLineCount);
  return getH1TitleLineDisappearStartMs(0, n, titleConfig);
}

function getH1TitleLineCount(format = state.format) {
  const config = getTitleConfig(format);
  return Math.max(1, splitTitleToLines(getP10TitleText("h1"), config.maxLines, config).length);
}

function getH2TitleLineCount(format = state.format) {
  const config = getTitleConfig(format);
  return Math.max(1, splitTitleToLines(getP10TitleText("h2"), config.maxLines, config).length);
}

function getH2TitleExportEndMs(titleConfig = getTitleConfig(), format = state.format) {
  const lineCount = getH2TitleLineCount(format);
  const stepMs = getTitleLineStepMs(lineCount, titleConfig);
  const disappearStart =
    (titleConfig.h2DisappearStartMs ?? titleConfig.disappearStartMs) + (lineCount - 1) * stepMs;
  return disappearStart + titleConfig.lineDuration;
}

function getH1TitleExportEndMs(titleConfig = getTitleConfig(), format = state.format) {
  const lineCount = getH1TitleLineCount(format);
  return (
    getH1TitleLineDisappearStartMs(0, lineCount, titleConfig) + titleConfig.lineDuration
  );
}

function getTitleExportEndMs(format = state.format) {
  const titleConfig = getTitleConfig(format);
  return els.toggleH2.checked
    ? getH2TitleExportEndMs(titleConfig, format)
    : getH1TitleExportEndMs(titleConfig, format);
}

function getBgRectExportEndMs(format = state.format) {
  const titleConfig = getTitleConfig(format);
  const lineCount = getH1TitleLineCount(format);
  return getBgRectDisappearStartMs(lineCount, titleConfig) + titleConfig.lineDuration;
}

function getBgRect2ExportEndMs(format = state.format) {
  if (!els.toggleH2.checked) return 0;
  return getH2TitleExportEndMs(getTitleConfig(format), format);
}

function getMediaExportEndMs(format = state.format) {
  if (format === "P10") {
    const bundleOpts = els.toggleQr.checked ? P10_QR_BUNDLE : P10_MEDIA;
    return bundleOpts.disappearStartMs + bundleOpts.disappearDuration;
  }
  if (els.toggleQr.checked) {
    return P12_QR_BUNDLE.disappearStartMs + P12_QR_BUNDLE.disappearDuration;
  }
  return P12_MEDIA.disappearStartMs + P12_MEDIA.disappearDuration;
}

function getAnimationExportEndMs(format = state.format) {
  const descConfig = getDescConfig(format);
  const descLines = splitDescriptionToLines(els.disc.value || "");
  const descEnd = getDescExportEndMs(descConfig, descLines.length);
  return Math.max(
    descEnd,
    getTitleExportEndMs(format),
    getBgRectExportEndMs(format),
    getBgRect2ExportEndMs(format),
    getMediaExportEndMs(format)
  );
}

function getH1TitleLineDisappearStartMs(lineIndex, lineCount, titleConfig = getTitleConfig()) {
  const n = Math.max(1, lineCount);
  const stepMs = getTitleLineStepMs(n, titleConfig);
  return getH1DisappearStartMs(titleConfig) + (n - 1 - lineIndex) * stepMs;
}

function getH1TitleLineStyle(tMs, lineIndex, lineCount, titleConfig = getTitleConfig()) {
  return getTimedBlockStyle(
    tMs,
    getTitleLineDelay(lineIndex, lineCount, titleConfig),
    getH1TitleLineDisappearStartMs(lineIndex, lineCount, titleConfig),
    titleConfig
  );
}

function getH2TitleLineStyle(tMs, lineIndex, lineCount, phaseStartMs, titleConfig = getTitleConfig()) {
  const appearStart = phaseStartMs + getTitleLineDelay(lineIndex, lineCount, titleConfig);
  // H2 lines disappear in reverse order starting at h2DisappearStartMs.
  const stepMs = getTitleLineStepMs(lineCount, titleConfig);
  const disappearStart = (titleConfig.h2DisappearStartMs ?? titleConfig.disappearStartMs)
    + (lineCount - 1 - lineIndex) * stepMs;
  return getTimedBlockStyle(tMs, appearStart, disappearStart, titleConfig);
}

function getTimedBlockStyle(tMs, appearStartMs, disappearStartMs, opts = getTitleConfig()) {
  if (tMs < appearStartMs) return lineAnimStyle(0, opts);
  if (tMs < disappearStartMs) {
    const p = easeTitle(Math.min(1, (tMs - appearStartMs) / opts.lineDuration));
    return lineAnimStyle(p, opts);
  }
  if (tMs < disappearStartMs + opts.lineDuration) {
    const p = easeTitle(Math.min(1, (tMs - disappearStartMs) / opts.lineDuration));
    return lineAnimStyle(1 - p, opts);
  }
  return lineAnimStyle(0, opts);
}

function lineAnimStyle(progress, opts = getTitleConfig()) {
  const hidden = 1 - progress;
  return {
    opacity: progress,
    translateY: opts.lineOffsetY * hidden,
    blur: opts.lineBlur * hidden,
  };
}

function splitDescriptionToLines(text) {
  const trimmed = text.trim();
  if (!trimmed) return [];
  const normalized = trimmed.replace(/<br\s*\/?>/gi, "\n");
  return normalized.split(/\n/).map((line) => line.trim()).filter(Boolean);
}

function getDescriptionLineStyle(tMs, lineIndex, descConfig = getDescConfig()) {
  const appearStart = descConfig.appearStartMs + lineIndex * descConfig.lineStepMs;
  const disappearStart = descConfig.disappearStartMs + lineIndex * descConfig.lineStepMs;
  return getTimedBlockStyle(tMs, appearStart, disappearStart, descConfig);
}

function getDescExportEndMs(descConfig, lineCount) {
  if (!lineCount || !els.toggleDisc.checked) return 0;
  const n = Math.max(1, lineCount);
  return descConfig.disappearStartMs + (n - 1) * descConfig.lineStepMs + descConfig.lineDuration;
}

function getP10ExportDurationSec() {
  return getAnimationExportEndMs("P10") / 1000;
}

function getP12ExportDurationSec() {
  return getAnimationExportEndMs("P12") / 1000;
}

function syncBgRect() {
  const rect = els.bgRect;
  if (!rect || state.exporting) return;
  if (state.format !== "P10" && state.format !== "P12") return;

  const titleConfig = getTitleConfig();
  const bgConfig = getBgRectConfig();
  const lineCount = getH1TitleLineCount(state.format);
  const t = state.elapsedMs;
  const appearStart = titleConfig.firstLineDelay;
  const disappearStart = getBgRectDisappearStartMs(lineCount, titleConfig);
  const anim = getTimedBlockStyle(t, appearStart, disappearStart, titleConfig);

  rect.style.position = "absolute";
  rect.style.left = `${bgConfig.left}px`;
  rect.style.top = `${bgConfig.top}px`;
  rect.style.right = "auto";
  rect.style.bottom = "auto";
  rect.style.margin = "0";
  rect.style.width = `${bgConfig.width}px`;
  rect.style.height = `${bgConfig.height}px`;
  rect.style.opacity = String(anim.opacity);
  rect.style.transform = `translateY(${anim.translateY}px)`;
  rect.style.filter = `blur(${anim.blur}px)`;
  rect.style.zIndex = "1";
  rect.classList.remove("is-in", "is-out");
}

function syncBgRect2() {
  const rect = els.bgRect2;
  if (!rect || state.exporting) return;
  if (!els.toggleH2.checked) {
    rect.style.opacity = "0";
    return;
  }
  if (state.format !== "P10" && state.format !== "P12") return;

  // Ensure phase state is up to date before timing calculations.
  syncTitlePhase();
  if (state.titlePhaseKey !== "h2") {
    rect.style.opacity = "0";
    return;
  }

  const titleConfig = getTitleConfig();
  const bgConfig = getBgRectConfig();
  const t = state.elapsedMs;

  // H2 rect appears when H2 phase starts and disappears at h2DisappearStartMs.
  const lines = getTitleLines(titleConfig);
  const lineCount = Math.max(1, lines.length);
  const phaseStart = state.titlePhaseStartMs;
  const appearStart = phaseStart + titleConfig.firstLineDelay;
  // Disappear together with the FIRST (top) line of H2 (which disappears last).
  const stepMs = getTitleLineStepMs(lineCount, titleConfig);
  const baseDisappear = titleConfig.h2DisappearStartMs ?? titleConfig.disappearStartMs;
  const disappearStart = baseDisappear + (lineCount - 1) * stepMs;
  const anim = getTimedBlockStyle(t, appearStart, disappearStart, titleConfig);

  rect.style.position = "absolute";
  rect.style.left = `${bgConfig.left}px`;
  rect.style.top = `${bgConfig.top}px`;
  rect.style.right = "auto";
  rect.style.bottom = "auto";
  rect.style.margin = "0";
  rect.style.width = `${bgConfig.width}px`;
  rect.style.height = `${bgConfig.height}px`;
  rect.style.opacity = String(anim.opacity);
  rect.style.transform = `translateY(${anim.translateY}px)`;
  rect.style.filter = `blur(${anim.blur}px)`;
  rect.style.zIndex = "1";
  rect.classList.remove("is-in", "is-out");
}

function drawBgRectOnCanvas(titleConfig = getTitleConfig(), bgConfig = getBgRectConfig()) {
  const lineCount = getH1TitleLineCount(state.format);
  const anim = getTimedBlockStyle(
    state.elapsedMs,
    titleConfig.firstLineDelay,
    getBgRectDisappearStartMs(lineCount, titleConfig),
    titleConfig
  );

  ctx.save();
  ctx.globalAlpha = anim.opacity;
  ctx.filter = `blur(${anim.blur}px)`;
  ctx.fillStyle = bgConfig.color;
  ctx.fillRect(
    bgConfig.left,
    bgConfig.top + anim.translateY,
    bgConfig.width,
    bgConfig.height
  );
  ctx.restore();
}

function drawBgRect2OnCanvas(titleConfig = getTitleConfig(), bgConfig = getBgRectConfig()) {
  if (!els.toggleH2.checked) return;

  syncTitlePhase();
  if (state.titlePhaseKey !== "h2") return;

  const lines = getTitleLines(titleConfig);
  const lineCount = Math.max(1, lines.length);
  const phaseStart = state.titlePhaseStartMs;
  const appearStart = phaseStart + titleConfig.firstLineDelay;
  const stepMs = getTitleLineStepMs(lineCount, titleConfig);
  const baseDisappear = titleConfig.h2DisappearStartMs ?? titleConfig.disappearStartMs;
  const disappearStart = baseDisappear + (lineCount - 1) * stepMs;
  const anim = getTimedBlockStyle(state.elapsedMs, appearStart, disappearStart, titleConfig);

  ctx.save();
  ctx.globalAlpha = anim.opacity;
  ctx.filter = `blur(${anim.blur}px)`;
  ctx.fillStyle = bgConfig.color;
  ctx.fillRect(
    bgConfig.left,
    bgConfig.top + anim.translateY,
    bgConfig.width,
    bgConfig.height
  );
  ctx.restore();
}

function renderDescriptionOverlay() {
  if (!els.sceneDescription || state.exporting) return;
  if (state.format !== "P10" && state.format !== "P12") return;

  if (!els.toggleDisc.checked) {
    els.sceneDescription.replaceChildren();
    return;
  }

  const descConfig = getDescConfig();
  const lines = splitDescriptionToLines(els.disc.value || "");
  const t = state.elapsedMs;
  const fragment = document.createDocumentFragment();

  lines.forEach((line, index) => {
    const span = document.createElement("span");
    span.className = "description-line";
    span.textContent = line;
    const anim = getDescriptionLineStyle(t, index, descConfig);
    span.style.opacity = String(anim.opacity);
    span.style.transform = `translateY(${anim.translateY}px)`;
    span.style.filter = `blur(${anim.blur}px)`;
    fragment.appendChild(span);
  });

  els.sceneDescription.replaceChildren(fragment);
}

function wrapDescriptionLineToWidth(line, maxWidth) {
  const words = line.split(/\s+/).filter(Boolean);
  if (!words.length) return [""];

  const lines = [];
  let current = "";
  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (current && ctx.measureText(next).width > maxWidth) {
      lines.push(current);
      current = word;
    } else if (!current && ctx.measureText(word).width > maxWidth) {
      lines.push(word);
      current = "";
    } else {
      current = next;
    }
  }
  if (current) lines.push(current);
  return lines.length ? lines : [""];
}

function drawDescriptionOnCanvas(descConfig = getDescConfig()) {
  if (!els.toggleDisc.checked) return;
  const sourceLines = splitDescriptionToLines(els.disc.value || "");
  if (!sourceLines.length) return;

  const h = els.canvas.height;
  const w = els.canvas.width;
  const contentBottom = h - descConfig.bottom;
  const lineStep = descConfig.fontSize * descConfig.lineHeight;
  const t = state.elapsedMs;
  const maxWidth = w - descConfig.marginX * 2;
  const bottomBaseline = contentBottom - 4;

  ctx.save();
  ctx.font = state.descFontReady
    ? getDescFontSpec(state.format)
    : `500 ${descConfig.fontSize}px Arial, sans-serif`;
  ctx.fillStyle = descConfig.color;
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  if ("letterSpacing" in ctx) ctx.letterSpacing = "-0.05em";

  const wrappedGroups = sourceLines.map((line) => wrapDescriptionLineToWidth(line, maxWidth));
  const visualLineEntries = [];
  wrappedGroups.forEach((group, sourceIndex) => {
    group.forEach((subLine) => visualLineEntries.push({ text: subLine, sourceIndex }));
  });
  const totalVisualLines = visualLineEntries.length;

  visualLineEntries.forEach((entry, visualIndex) => {
    const anim = getDescriptionLineStyle(t, entry.sourceIndex, descConfig);
    const y = bottomBaseline - (totalVisualLines - 1 - visualIndex) * lineStep;
    ctx.save();
    ctx.globalAlpha = anim.opacity;
    ctx.filter = `blur(${anim.blur}px)`;
    ctx.translate(0, anim.translateY);
    ctx.fillText(entry.text, w / 2, y);
    ctx.restore();
  });
  ctx.restore();
}

function syncTitlePhase() {
  const key = getP10TitlePhaseKey();
  if (key !== state.titlePhaseKey) {
    state.titlePhaseKey = key;
    state.titlePhaseStartMs = state.elapsedMs;
    state.titleLinesCache = "";
  }
}

function resetTitlePhase() {
  state.titlePhaseKey = getP10TitlePhaseKey();
  state.titlePhaseStartMs = state.elapsedMs;
  state.titleLinesCache = "";
}

function getTitleLines(titleConfig = getTitleConfig()) {
  const text = getP10TitleText(state.titlePhaseKey);
  const cacheKey = `${state.format}:${text}`;
  if (cacheKey !== state.titleLinesCache) {
    state.titleLinesCache = cacheKey;
    state.titleLines = splitTitleToLines(text, titleConfig.maxLines, titleConfig);
    state.titlePhaseStartMs = state.elapsedMs;
  }
  return state.titleLines;
}

function renderTitleOverlay() {
  if (!els.sceneTitle || state.exporting) return;
  if (state.format !== "P12") return;

  const titleConfig = getTitleConfig();
  syncTitlePhase();
  const lines = getTitleLines(titleConfig);
  const t = state.elapsedMs;
  const isH2 = state.titlePhaseKey === "h2";
  const fragment = document.createDocumentFragment();

  lines.forEach((line, index) => {
    const span = document.createElement("span");
    span.className = "title-line";
    span.textContent = line;
    const anim = isH2
      ? getH2TitleLineStyle(t, index, lines.length, state.titlePhaseStartMs, titleConfig)
      : getH1TitleLineStyle(t, index, lines.length, titleConfig);
    span.style.opacity = String(anim.opacity);
    span.style.transform = `translateY(${anim.translateY}px)`;
    span.style.filter = `blur(${anim.blur}px)`;
    fragment.appendChild(span);
  });

  els.sceneTitle.replaceChildren(fragment);
}

function drawTitleOnCanvas(titleConfig = getTitleConfig()) {
  syncTitlePhase();
  const isH2 = state.titlePhaseKey === "h2";
  const lines = getTitleLines(titleConfig);
  const t = state.elapsedMs;
  const x = titleConfig.left ?? titleConfig.marginX;
  const lineStep = titleConfig.fontSize * titleConfig.lineHeight;
  const startY =
    (titleConfig.top ?? titleConfig.marginTop) + titleConfig.fontSize * 0.82;

  ctx.save();
  ctx.font = state.titleFontReady
    ? getTitleFontSpec(state.format)
    : `600 ${titleConfig.fontSize}px Arial, sans-serif`;
  ctx.fillStyle = "#e9e9ff";
  ctx.textBaseline = "alphabetic";
  if ("letterSpacing" in ctx) ctx.letterSpacing = "-0.05em";

  lines.forEach((line, index) => {
    const anim = isH2
      ? getH2TitleLineStyle(t, index, lines.length, state.titlePhaseStartMs, titleConfig)
      : getH1TitleLineStyle(t, index, lines.length, titleConfig);
    const y = startY + lineStep * index;
    ctx.save();
    ctx.globalAlpha = anim.opacity;
    ctx.filter = `blur(${anim.blur}px)`;
    ctx.translate(0, anim.translateY);
    ctx.fillText(line, x, y);
    ctx.restore();
  });
  ctx.restore();
}

function drawTextBlocks() {
  if (state.format === "P10") {
    if (state.exporting) {
      drawBgRectOnCanvas(P10_TITLE, P10_BG_RECT);
      drawBgRect2OnCanvas(P10_TITLE, P10_BG_RECT);
    }
    drawTitleOnCanvas(P10_TITLE);
    ctx.filter = "none";
    ctx.globalAlpha = 1;
    if (state.exporting) {
      drawDescriptionOnCanvas(P10_DESC);
      ctx.filter = "none";
      ctx.globalAlpha = 1;
    }
    return;
  }

  if (state.format === "P12") {
    if (state.exporting) {
      drawBgRectOnCanvas(P12_TITLE, P12_BG_RECT);
      drawBgRect2OnCanvas(P12_TITLE, P12_BG_RECT);
      drawTitleOnCanvas(P12_TITLE);
      drawDescriptionOnCanvas(P12_DESC);
      ctx.filter = "none";
      ctx.globalAlpha = 1;
    }
    return;
  }
}

function drawAsset(asset, x, y, w, h) {
  if (!asset) return;
  ctx.drawImage(asset.image, x, y, w, h);
}

function drawQr() {
  if (!els.toggleQr.checked || !state.assets.qr) return;
  if (state.format === "P10" || state.format === "P12") return;
  const s = previewPx(84);
  const inset = previewPx(18);
  drawAsset(
    state.assets.qr,
    els.canvas.width - s - inset,
    els.canvas.height - s - inset,
    s,
    s
  );
}

function renderFrame(ts = 0) {
  if (!state.exporting && state.lastTs && state.isPlaying) {
    state.elapsedMs += ts - state.lastTs;
  }
  state.lastTs = ts;
  drawBackground();

  // Each format has its own dedicated upload slot:
  // P10 uses img1, P12 uses img2.
  if (state.format === "P10" && state.assets.img1) {
    if (isP10QrMode() && state.exporting) {
      drawQrBundleOnCanvas();
    } else if (state.exporting && isP10MediaNoQr()) {
      drawP10MediaOnCanvas();
    }
  }

  if (state.format === "P12" && state.assets.img2 && state.exporting) {
    if (isP12QrMode()) drawQrBundleOnCanvas();
    else if (isP12MediaNoQr()) drawP12MediaOnCanvas();
  }
  drawQr();
  drawTextBlocks();
  if (state.format === "P10") {
    syncSceneMediaOverlay();
    syncQrBundleOverlay();
    syncBgRect();
    syncBgRect2();
    renderDescriptionOverlay();
  } else if (state.format === "P12") {
    syncSceneMediaOverlay();
    syncQrBundleOverlay();
    renderTitleOverlay();
    renderDescriptionOverlay();
    syncBgRect();
    syncBgRect2();
  }
  syncSlotHeroVideoPlayback();
}

function loop(ts) {
  if (!state.startAt) state.startAt = ts;
  renderFrame(ts);
  if (state.isPlaying) state.rafId = requestAnimationFrame(loop);
}

function restartAnimation() {
  if (state.rafId) {
    cancelAnimationFrame(state.rafId);
    state.rafId = 0;
  }

  state.elapsedMs = 0;
  state.lastTs = 0;
  state.startAt = 0;
  state.titlePhaseKey = "h1";
  state.titlePhaseStartMs = 0;
  state.titleLinesCache = "";

  for (const format of ["P10", "P12"]) {
    const video = sceneBackgrounds[format].video;
    if (!video) continue;
    video.pause();
    video.currentTime = 0;
  }

  for (const slot of ["img1", "img2"]) {
    const asset = state.assets[slot];
    if (asset?.kind === "video" && asset.video) {
      asset.video.pause();
      asset.video.currentTime = 0;
    }
  }

  renderFrame(performance.now());
  setPlaying(true);
}

function setPlaying(playing) {
  state.isPlaying = playing;
  if (playing) {
    for (const format of ["P10", "P12"]) {
      const video = sceneBackgrounds[format].video;
      if (video?.ended) video.currentTime = 0;
    }
    for (const slot of ["img1", "img2"]) {
      const asset = state.assets[slot];
      if (asset?.kind === "video" && asset.video?.ended) asset.video.currentTime = 0;
    }
  }
  syncSceneBackgroundPlayback();
  syncSlotHeroVideoPlayback();
  if (playing && !state.rafId) {
    state.lastTs = 0;
    state.rafId = requestAnimationFrame(loop);
  }
  if (!playing && state.rafId) {
    cancelAnimationFrame(state.rafId);
    state.rafId = 0;
  }
}

function loadImageFromUrl(url, fileName) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () =>
      resolve({
        image,
        width: image.width,
        height: image.height,
        previewSrc: url,
        file: { name: fileName },
        kind: "image",
      });
    image.onerror = reject;
    image.src = url;
  });
}

async function attachSlotVideo(slot, { src, file, objectUrl = null }) {
  const errorEl = slot === "img1" ? els.err1 : els.err2;
  const card = slot === "img1" ? els.cardImg1 : els.cardImg2;
  const fallbackIcon = "./icon/16/image.svg";

  disposeSlotAsset(slot);

  const domVideo =
    slot === "img1" ? getImg1HeroVideoEl() : slot === "img2" ? getImg2HeroVideoEl() : null;
  const video = domVideo || createHiddenSlotVideo();
  video.pause();
  video.loop = false;
  video.muted = true;
  video.playsInline = true;
  video.src = src;

  await waitSlotVideoReady(video);

  state.assets[slot] = {
    kind: "video",
    video,
    previewSrc: src,
    objectUrl,
    file: file || { name: src.split("/").pop() },
    width: video.videoWidth,
    height: video.videoHeight,
    ownsVideo: !domVideo,
  };
  if (domVideo) {
    domVideo.hidden = false;
    domVideo.removeAttribute("hidden");
    domVideo.style.opacity = "1";
  }
  if (slot === "img1") bindImg1HeroVideoToOverlay();
  if (slot === "img2") bindImg2HeroVideoToOverlay();
  setFileError(errorEl);
  setCardAsset(card, state.assets[slot], slot, fallbackIcon);
}

async function loadDefaultSlotVideo(slot, config) {
  if (!config) return;
  const errorEl = slot === "img1" ? els.err1 : els.err2;
  try {
    await attachSlotVideo(slot, { src: config.src, file: { name: config.name } });
  } catch {
    clearSlot(slot);
    setFileError(errorEl, "Failed to load default video");
  }
}

async function loadDefaultSlotImage(slot, config) {
  const limitsForSlot = getCurrentLimits();
  const limit = slot === "img1" ? limitsForSlot.P10 : limitsForSlot.P12;
  const errorEl = slot === "img1" ? els.err1 : els.err2;
  const card = slot === "img1" ? els.cardImg1 : els.cardImg2;
  const fallbackIcon = "./icon/16/image.svg";

  disposeSlotAsset(slot);

  try {
    const loaded = await loadImageFromUrl(config.src, config.name);
    if (loaded.width > limit.w || loaded.height > limit.h) {
      clearSlot(slot);
      setFileError(errorEl, `File exceeds limit ${limit.w}x${limit.h}`);
      return;
    }
    state.assets[slot] = loaded;
    setFileError(errorEl);
    setCardAsset(card, loaded, slot, fallbackIcon);
  } catch {
    clearSlot(slot);
    setFileError(errorEl, "Failed to load default image");
  }
}

function isFactoryPreviewAsset(slot) {
  const name = state.assets[slot]?.file?.name;
  if (!name) return true;
  return [
    DEFAULT_PREVIEW_IMAGES.img1.name,
    DEFAULT_PREVIEW_IMAGES.img1Qr.name,
    DEFAULT_PREVIEW_IMAGES.img2.name,
    DEFAULT_PREVIEW_IMAGES.img2Qr.name,
  ].includes(name);
}

async function loadDefaultImg1() {
  if (els.toggleQr.checked) {
    if (state.mediaType === "video") {
      // No default videos
      return;
    } else {
      await loadDefaultSlotImage("img1", P10_QR_DEFAULT_ASSETS.image);
    }
  } else if (state.mediaType === "video") {
    // No default videos
    return;
  } else {
    await loadDefaultSlotImage("img1", DEFAULT_PREVIEW_IMAGES.img1);
  }
}

async function loadDefaultImg2() {
  if (els.toggleQr.checked) {
    if (state.mediaType === "video") {
      // No default videos
      return;
    } else {
      await loadDefaultSlotImage("img2", DEFAULT_PREVIEW_IMAGES.img2Qr);
    }
  } else if (state.mediaType === "video") {
    // No default videos
    return;
  } else {
    await loadDefaultSlotImage("img2", DEFAULT_PREVIEW_IMAGES.img2);
  }
}

async function loadDefaultPreviewImages() {
  const tasks = [loadDefaultImg1(), loadDefaultImg2()];
  await Promise.all(tasks);
}

async function applyP10QrDefaults() {
  if (isFactoryPreviewAsset("img1")) {
    if (state.mediaType === "video") {
      // No default videos
      // keep empty until user uploads
    } else {
      await loadDefaultSlotImage("img1", P10_QR_DEFAULT_ASSETS.image);
    }
  }
}

async function applyP10NoQrDefaults() {
  if (isFactoryPreviewAsset("img1")) {
    if (state.mediaType === "video") {
      // No default videos
      // keep empty until user uploads
    } else {
      await loadDefaultSlotImage("img1", DEFAULT_PREVIEW_IMAGES.img1);
    }
  }
}

async function applyP12QrDefaults() {
  if (isFactoryPreviewAsset("img2")) {
    if (state.mediaType === "video") {
      // No default videos
      // keep empty until user uploads
    } else {
      await loadDefaultSlotImage("img2", DEFAULT_PREVIEW_IMAGES.img2Qr);
    }
  }
}

async function applyP12NoQrDefaults() {
  if (isFactoryPreviewAsset("img2")) {
    if (state.mediaType === "video") {
      // No default videos
      // keep empty until user uploads
    } else {
      await loadDefaultSlotImage("img2", DEFAULT_PREVIEW_IMAGES.img2);
    }
  }
}

function readImageFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const image = new Image();
      image.onload = () =>
        resolve({
          image,
          width: image.width,
          height: image.height,
          previewSrc: reader.result,
          file,
        });
      image.onerror = reject;
      image.src = reader.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function handleImageUpload(input, slot, limit, errorEl, card, fallbackIcon) {
  const file = input.files?.[0];
  if (!file) return;
  if (state.mediaType === "video") {
    if (!file.name.toLowerCase().endsWith(".mp4")) {
      clearSlot(slot);
      setFileError(errorEl, "Only MP4 is allowed");
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    try {
      await attachSlotVideo(slot, { src: objectUrl, file, objectUrl });
      renderFrame(performance.now());
    } catch {
      URL.revokeObjectURL(objectUrl);
      clearSlot(slot);
      setFileError(errorEl, "Failed to load video");
    }
    return;
  }
  try {
    const loaded = await readImageFile(file);
    loaded.kind = "image";
    if (loaded.width > limit.w || loaded.height > limit.h) {
      clearSlot(slot);
      setFileError(errorEl, `File exceeds limit ${limit.w}x${limit.h}`);
      return;
    }
    state.assets[slot] = loaded;
    setFileError(errorEl);
    setCardAsset(card, loaded, slot, fallbackIcon);
    renderFrame(performance.now());
  } catch {
    clearSlot(slot);
    setFileError(errorEl, "Failed to load file");
  }
}

function readQrSvgFile(file) {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () =>
      resolve({
        image,
        width: image.width,
        height: image.height,
        previewSrc: objectUrl,
        objectUrl,
        file,
        kind: "image",
      });
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Failed to load QR"));
    };
    image.src = objectUrl;
  });
}

async function handleQrUpload() {
  const scroll = captureViewportScroll();
  const file = els.qrFile.files?.[0];
  if (!file) {
    restoreViewportScroll(scroll);
    return;
  }
  if (!file.name.toLowerCase().endsWith(".svg")) {
    clearSlot("qr");
    setFileError(els.errQr, "QR requires SVG");
    restoreViewportScroll(scroll);
    return;
  }
  try {
    revokeAssetPreviewUrl(state.assets.qr);
    const loaded = await readQrSvgFile(file);
    state.assets.qr = loaded;
    setFileError(els.errQr);
    setCardAsset(els.cardQr, loaded, "qr", "./icon/16/qr.svg");
    updateSceneScale();
    renderFrame(performance.now());
  } catch {
    clearSlot("qr");
    setFileError(els.errQr, "Failed to load QR");
  } finally {
    if (document.activeElement === els.qrFile) els.qrFile.blur();
    requestAnimationFrame(() => {
      restoreViewportScroll(scroll);
      updateSceneScale();
    });
  }
}

function getExportRecorderCandidates() {
  const mp4Candidates = [
    { mimeType: "video/mp4;codecs=avc1", ext: "mp4" },
    { mimeType: "video/mp4;codecs=avc1.42E01E", ext: "mp4" },
    { mimeType: "video/mp4", ext: "mp4" },
  ];
  if (typeof MediaRecorder === "undefined") return [];
  const supportedMp4 = mp4Candidates.filter((c) => MediaRecorder.isTypeSupported(c.mimeType));
  return supportedMp4;
}

function waitVideoFrame(video, timeoutMs = 4000) {
  if (!video) return Promise.resolve();
  if (video.readyState >= 2) return Promise.resolve();
  return new Promise((resolve) => {
    const timer = setTimeout(resolve, timeoutMs);
    const done = () => {
      clearTimeout(timer);
      resolve();
    };
    video.addEventListener("loadeddata", done, { once: true });
    video.addEventListener("error", done, { once: true });
  });
}

function createCanvasCaptureStream() {
  let stream;
  let manualCapture = false;
  try {
    stream = els.canvas.captureStream(0);
    manualCapture = true;
  } catch {
    stream = els.canvas.captureStream(30);
  }
  const captureTrack = stream.getVideoTracks()[0];
  if (!captureTrack) return { stream, captureTrack: null, manualCapture: false };
  if (manualCapture && typeof captureTrack.requestFrame !== "function") {
    stream.getTracks().forEach((track) => track.stop());
    stream = els.canvas.captureStream(30);
    manualCapture = false;
    return { stream, captureTrack: stream.getVideoTracks()[0] ?? null, manualCapture };
  }
  return { stream, captureTrack, manualCapture };
}

function prepareExportVideosSync(targetFormat) {
  for (const format of ["P10", "P12"]) {
    const video = sceneBackgrounds[format].video;
    if (!video) continue;
    video.pause();
    video.currentTime = 0;
  }

  const exportSlot = targetFormat === "P10" ? "img1" : "img2";
  const slotAsset = state.assets[exportSlot];
  if (slotAsset?.kind === "video" && slotAsset.previewSrc) {
    if (exportSlot === "img1") bindImg1HeroVideoToOverlay();
    else bindImg2HeroVideoToOverlay();
    if (slotAsset.video) {
      slotAsset.video.pause();
      slotAsset.video.currentTime = 0;
    }
  }
}

function captureExportFrame(captureTrack, manualCapture) {
  if (manualCapture && captureTrack && typeof captureTrack.requestFrame === "function") {
    captureTrack.requestFrame();
  }
}

/** Start recorder synchronously (Safari requires user-gesture context). */
function startCanvasRecorder() {
  const candidates = getExportRecorderCandidates();
  const { stream, captureTrack, manualCapture } = createCanvasCaptureStream();
  if (!stream.getVideoTracks().length) {
    throw new Error("Canvas stream has no video track");
  }

  for (const { mimeType, ext } of candidates) {
    const chunks = [];
    let recorder;
    try {
      recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
    } catch {
      continue;
    }

    let resolveStop;
    let rejectStop;
    const stopped = new Promise((resolve, reject) => {
      resolveStop = resolve;
      rejectStop = reject;
    });

    recorder.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) chunks.push(event.data);
    };
    recorder.onerror = () => rejectStop(new Error("MediaRecorder failed"));
    recorder.onstop = () => resolveStop();

    try {
      recorder.start(100);
    } catch {
      try {
        recorder.start();
      } catch {
        continue;
      }
    }

    return {
      stream,
      recorder,
      captureTrack,
      manualCapture,
      ext,
      mimeType,
      finish: async (timeoutMs = 30000) => {
        if (recorder.state === "recording") {
          if (typeof recorder.requestData === "function") recorder.requestData();
          recorder.stop();
        }
        await Promise.race([
          stopped,
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Recorder timeout")), timeoutMs)
          ),
        ]);
        stream.getTracks().forEach((track) => track.stop());
        const type = recorder.mimeType || mimeType || "video/mp4";
        return new Blob(chunks, { type });
      },
    };
  }

  stream.getTracks().forEach((track) => track.stop());
  throw new Error("MediaRecorder is not available");
}

function resetExportTimeline() {
  state.elapsedMs = 0;
  state.lastTs = 0;
  state.startAt = 0;
  state.titlePhaseKey = "h1";
  state.titlePhaseStartMs = 0;
  state.titleLinesCache = "";
}

function getExportDurationSec(format) {
  return format === "P10" ? getP10ExportDurationSec() : getP12ExportDurationSec();
}

async function exportVideo(targetFormat) {
  if (state.exporting) return;
  if (typeof MediaRecorder === "undefined") {
    els.exportNote.textContent = "Экспорт не поддерживается в этом браузере";
    return;
  }
  if (location.protocol === "file:") {
    els.exportNote.textContent = "Откройте страницу через локальный сервер, не file://";
    return;
  }

  const prevFormat = state.format;
  setPlaying(false);

  state.format = targetFormat;
  applyFormatUi();
  enforceLimitsWithCurrentMode();

  const size = previewSizes[targetFormat];
  els.canvas.width = size.w;
  els.canvas.height = size.h;

  state.exporting = true;
  els.previewFrame?.classList.add("is-exporting");
  if (els.sceneUi) els.sceneUi.hidden = true;
  els.exportBtn.disabled = true;
  if (els.exportBtnSecondary) els.exportBtnSecondary.disabled = true;
  els.exportNote.textContent = "Экспорт…";

  resetExportTimeline();
  prepareExportVideosSync(targetFormat);

  let recording = null;
  let blob = null;
  let ext = "mp4";
  const fps = 30;
  const frameMs = 1000 / fps;
  const durationSec = Math.max(1, getExportDurationSec(targetFormat));
  const totalFrames = Math.ceil(durationSec * fps);

  try {
    if (!getExportRecorderCandidates().length) {
      throw new Error("MP4 not supported");
    }
    // Start recorder immediately while the click user-gesture is still active (Safari).
    recording = startCanvasRecorder();

    resetExportTimeline();

    for (let frame = 0; frame < totalFrames; frame++) {
      state.elapsedMs = frame * frameMs;
      renderFrame(state.elapsedMs);
      captureExportFrame(recording.captureTrack, recording.manualCapture);
      await new Promise((resolve) => setTimeout(resolve, frameMs));
    }

    blob = await recording.finish((durationSec + 10) * 1000);
    ext = recording.ext;
  } catch (error) {
    if (recording?.stream) {
      recording.stream.getTracks().forEach((track) => track.stop());
    }
    els.exportNote.textContent =
      error?.message === "MP4 not supported"
        ? "MP4 недоступен в этом браузере. Откройте в Safari или Chrome."
        : "Ошибка экспорта";
  } finally {
    state.exporting = false;
    els.previewFrame?.classList.remove("is-exporting");
    els.exportBtn.disabled = false;
    if (els.exportBtnSecondary) els.exportBtnSecondary.disabled = false;

    if (prevFormat !== targetFormat) {
      state.format = prevFormat;
      applyFormatUi();
      enforceLimitsWithCurrentMode();
    }
    if (els.sceneUi) els.sceneUi.hidden = false;

    for (const format of ["P10", "P12"]) {
      const video = sceneBackgrounds[format].video;
      if (video) {
        video.pause();
        video.currentTime = 0;
      }
    }
    for (const slot of ["img1", "img2"]) {
      const asset = state.assets[slot];
      if (asset?.kind === "video" && asset.video) {
        asset.video.pause();
        asset.video.currentTime = 0;
      }
    }

    resetExportTimeline();
    state.lastTs = 0;
    setPlaying(false);
    renderFrame(performance.now());
  }

  if (!blob || blob.size === 0) {
    els.exportNote.textContent = "Ошибка экспорта: пустой файл";
    return;
  }

  const actualType = recording?.recorder?.mimeType || blob.type || "";
  if (!actualType.includes("mp4") && ext !== "mp4") {
    els.exportNote.textContent = "MP4 недоступен в этом браузере. Откройте в Safari или Chrome.";
    return;
  }

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `ad-${targetFormat.toLowerCase()}-${size.w}x${size.h}.mp4`;
  a.click();
  URL.revokeObjectURL(url);

  els.exportNote.textContent = "Готово";
  setTimeout(() => {
    if (els.exportNote.textContent.startsWith("Готово")) els.exportNote.textContent = "";
  }, 2500);
}

function wireEvents() {
  [els.h1, els.h2, els.disc].forEach((el) => {
    el.addEventListener("input", () => {
      updateCounters();
      if (el === els.h1 || el === els.h2) state.titleLinesCache = "";
      renderFrame(performance.now());
    });
  });

  els.toggleH2.addEventListener("change", () => {
    syncH2ControlsUi();
    state.elapsedMs = 0;
    state.lastTs = 0;
    resetTitlePhase();
    renderFrame(performance.now());
  });

  els.toggleDisc.addEventListener("change", () => {
    renderFrame(performance.now());
  });

  els.formatBtns.forEach((btn) =>
    btn.addEventListener("click", () => {
      state.format = btn.dataset.format;
      applyFormatUi();
      enforceLimitsWithCurrentMode();
      renderFrame(performance.now());
    })
  );

  els.mediaBtns.forEach((btn) =>
    btn.addEventListener("click", async () => {
      const nextType = btn.dataset.media;
      if (nextType === state.mediaType) return;
      clearSlot("img1");
      clearSlot("img2");
      state.mediaType = btn.dataset.media;
      applyMediaUi();
      await loadDefaultPreviewImages();
      enforceLimitsWithCurrentMode();
      renderFrame(performance.now());
    })
  );

  els.toggleQr.addEventListener("change", async () => {
    const scroll = captureViewportScroll();
    updateQrUi();
    enforceLimitsWithCurrentMode();
    if (els.toggleQr.checked) {
      await applyP10QrDefaults();
      await applyP12QrDefaults();
    } else {
      await applyP10NoQrDefaults();
      await applyP12NoQrDefaults();
    }
    renderFrame(performance.now());
    requestAnimationFrame(() => restoreViewportScroll(scroll));
  });

  els.img1.addEventListener("change", () => {
    const l = getCurrentLimits();
    handleImageUpload(els.img1, "img1", l.P10, els.err1, els.cardImg1, "./icon/16/image.svg");
  });
  els.img2.addEventListener("change", () => {
    const l = getCurrentLimits();
    handleImageUpload(els.img2, "img2", l.P12, els.err2, els.cardImg2, "./icon/16/image.svg");
  });
  els.qrFile.addEventListener("change", handleQrUpload);

  els.cardQr?.addEventListener("click", (e) => {
    if (e.target.closest(".card-delete")) return;
    e.preventDefault();
    els.qrFile.click();
  });

  els.delImg1.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    clearSlot("img1");
    renderFrame(performance.now());
  });
  els.delImg2.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    clearSlot("img2");
    renderFrame(performance.now());
  });
  els.delQr.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    clearSlot("qr");
    renderFrame(performance.now());
  });

  els.replayAnimationBtn?.addEventListener("click", restartAnimation);
  els.exportBtn.addEventListener("click", () => exportVideo("P10"));
  els.exportBtnSecondary?.addEventListener("click", () => exportVideo("P12"));
}

let sceneFontsPromise = null;

function loadSceneFonts() {
  if (!sceneFontsPromise) {
    sceneFontsPromise = (async () => {
      try {
        const semi = new FontFace(
          "SB Sans Display",
          'url("./fonts/SBSansDisplay-SemiBold.otf")',
          { weight: "600", style: "normal" }
        );
        const medium = new FontFace(
          "SB Sans Display",
          'url("./fonts/SBSansDisplay-Medium.otf")',
          { weight: "500", style: "normal" }
        );
        await Promise.all([semi.load(), medium.load()]);
        document.fonts.add(semi);
        document.fonts.add(medium);
        state.titleFontReady = true;
        state.descFontReady = true;
      } catch {
        state.titleFontReady = false;
        state.descFontReady = false;
      }
    })();
  }
  return sceneFontsPromise;
}

function syncH2ControlsUi() {
  const on = els.toggleH2.checked;
  if (els.toggleH2Icon) {
    els.toggleH2Icon.src = on ? "./icon/16/minus.svg" : "./icon/16/pluse.svg";
  }
  if (els.h2InputStack) els.h2InputStack.hidden = !on;
  if (els.h2Section) els.h2Section.classList.toggle("is-collapsed", !on);
}

function init() {
  els.h1.value = DEFAULT_H1_TEXT;
  els.h2.value = DEFAULT_H2_TEXT;
  els.toggleH2.checked = false;
  els.disc.value = DEFAULT_DISC_TEXT;
  initSceneBackgrounds();
  loadSceneFonts();
  updateCounters();
  applyFormatUi();
  applyMediaUi();
  updateQrUi();
  syncH2ControlsUi();
  wireEvents();

  let ready = 0;
  let previewBootstrapped = false;
  const onBgReady = async () => {
    ready += 1;
    if (ready >= 2 && !previewBootstrapped) {
      previewBootstrapped = true;
      await loadDefaultPreviewImages();
      syncSceneBackgroundPlayback();
      renderFrame(performance.now());
      setPlaying(true);
    }
  };
  for (const format of ["P10", "P12"]) {
    const video = sceneBackgrounds[format].video;
    video.addEventListener("loadeddata", onBgReady, { once: true });
    video.addEventListener("error", onBgReady, { once: true });
  }
}

init();
