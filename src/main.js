import { content } from './content.js';

const html = document.documentElement;
const audienceButtons = [...document.querySelectorAll('[data-audience-choice]')];
const title = document.querySelector('[data-hero-title]');
const sentence = document.querySelector('[data-hero-sentence]');
const canvas = document.querySelector('[data-hero-canvas]');
const heroStage = document.querySelector('[data-hero-stage]');
const fallback = document.querySelector('[data-hero-fallback]');
let currentAudience = content.hero.audiences[0];
let albumController;

function setAudience(id) {
  const next = content.hero.audiences.find((item) => item.id === id);
  if (!next || next.id === currentAudience.id) return;
  currentAudience = next;
  title.textContent = next.title;
  sentence.textContent = next.sentence;
  html.dataset.audience = next.id;

  for (const button of audienceButtons) {
    const selected = button.dataset.audienceChoice === next.id;
    button.classList.toggle('is-selected', selected);
    button.setAttribute('aria-pressed', String(selected));
  }

  // Each audience has its own spread; the book turns to it.
  goToSpread(next.spread);
}

for (const button of audienceButtons) {
  button.addEventListener('click', () => setAudience(button.dataset.audienceChoice));
}

const materialItems = content.sections.materials.items;
const materialButtons = [...document.querySelectorAll('[data-material]')];
const materialView = document.querySelector('.materials-detail__image');

function setResponsiveImage(imageElement, source) {
  imageElement.src = source;
  imageElement.srcset = [480, 800, 1200]
    .map((size) => `${source.replace(/-800\.webp$/, `-${size}.webp`)} ${size}w`)
    .join(', ');
}

for (const button of materialButtons) {
  button.addEventListener('click', () => {
    const item = materialItems.find((material) => material.id === button.dataset.material);
    if (!item) return;
    setResponsiveImage(materialView, item.image);
    materialView.alt = item.alt;
    for (const choice of materialButtons) {
      const selected = choice === button;
      choice.classList.toggle('is-selected', selected);
      choice.setAttribute('aria-pressed', String(selected));
    }
  });
}

const exampleItems = content.sections.services.examples;
const exampleButtons = [...document.querySelectorAll('[data-example]')];
const compareRange = document.querySelector('#editing-range');
const compareFrame = document.querySelector('[data-compare-frame]');
const compareBefore = document.querySelector('.compare-frame__before');
const compareAfter = document.querySelector('.compare-frame__after');

function setExample(id) {
  const item = exampleItems.find((example) => example.id === id);
  if (!item) return;
  setResponsiveImage(compareBefore, item.before);
  setResponsiveImage(compareAfter, item.after);
  compareAfter.alt = `${item.alt} After editing.`;
  for (const button of exampleButtons) {
    const selected = button.dataset.example === item.id;
    button.classList.toggle('is-selected', selected);
    button.setAttribute('aria-pressed', String(selected));
  }
}

for (const button of exampleButtons) {
  button.addEventListener('click', () => setExample(button.dataset.example));
}

function setComparePosition(value) {
  compareFrame.style.setProperty('--compare-position', `${value}%`);
  compareRange.setAttribute('aria-valuetext', `${value}% before, ${100 - value}% after`);
}

compareRange?.addEventListener('input', () => setComparePosition(compareRange.value));
setComparePosition(compareRange?.value ?? 50);

const menu = document.querySelector('#mobile-menu');
const menuPanel = menu?.querySelector('.mobile-menu__panel');
const menuClose = menu?.querySelector('[data-menu-close]');
const menuBrand = document.querySelector('.header-row > .brand');
const desktopNavigation = document.querySelector('.desktop-nav-area');
const pageMain = document.querySelector('main');
const pageFooter = document.querySelector('.site-footer');

function updateMobileMenu(open, moveFocus = false) {
  if (!menu) return;
  menu.open = open;
  html.classList.toggle('menu-open', open);
  if (menuBrand) menuBrand.inert = open;
  if (desktopNavigation) desktopNavigation.inert = open;
  if (pageMain) pageMain.inert = open;
  if (pageFooter) pageFooter.inert = open;
  if (open && moveFocus) menuClose?.focus();
  if (!open && moveFocus) menu.querySelector('summary')?.focus();
}

menu?.addEventListener('toggle', () => {
  const open = menu.open;
  html.classList.toggle('menu-open', open);
  if (menuBrand) menuBrand.inert = open;
  if (desktopNavigation) desktopNavigation.inert = open;
  if (pageMain) pageMain.inert = open;
  if (pageFooter) pageFooter.inert = open;
  if (open) requestAnimationFrame(() => menuClose?.focus());
});

menuClose?.addEventListener('click', () => updateMobileMenu(false, true));

menuPanel?.addEventListener('click', (event) => {
  if (event.target.closest('a')) updateMobileMenu(false);
});

document.addEventListener('keydown', (event) => {
  if (menu?.open && event.key === 'Escape') {
    event.preventDefault();
    updateMobileMenu(false, true);
    return;
  }

  if (menu?.open && event.key === 'Tab') {
    const focusable = [...menuPanel.querySelectorAll('a, button, summary')]
      .filter((element) => !element.disabled && !element.closest('[inert]'));
    const first = focusable[0];
    const last = focusable.at(-1);
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  }
});

const productsMenu = document.querySelector('#products-menu');
productsMenu?.addEventListener('click', (event) => {
  if (event.target.closest('a')) productsMenu.open = false;
});

document.addEventListener('pointerdown', (event) => {
  if (productsMenu?.open && !productsMenu.contains(event.target)) productsMenu.open = false;
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && productsMenu?.open) {
    productsMenu.open = false;
    productsMenu.querySelector('summary')?.focus();
  }
});

const contact = content.sections.contact;
const form = document.querySelector('#contact-form');
const formStatus = document.querySelector('#contact-status');
const submit = form?.querySelector('[type="submit"]');

function resolveEndpoint(value) {
  if (!value?.trim()) return '';
  try {
    const endpoint = new URL(value.trim(), window.location.href);
    return ['https:', 'http:'].includes(endpoint.protocol) ? endpoint.toString() : '';
  } catch {
    return '';
  }
}

const formEndpoint = resolveEndpoint(import.meta.env.VITE_ULTRAA_FORM_ENDPOINT);
const fieldMessages = {
  name: contact.validation.name,
  email: contact.validation.email,
  message: contact.validation.message,
};

function fieldMessage(field) {
  if (!field.value.trim()) return fieldMessages[field.name] ?? '';
  if (field.name === 'email' && field.validity.typeMismatch) return contact.validation.emailInvalid;
  if (field.validity.tooLong) return contact.validation.tooLong;
  return '';
}

function setFieldError(field, message) {
  const error = document.querySelector(`[data-field-error="${field.name}"]`);
  field.toggleAttribute('aria-invalid', Boolean(message));
  if (error) error.textContent = message;
}

function validateField(field) {
  const message = fieldMessage(field);
  setFieldError(field, message);
  return !message;
}

if (form) {
  const fields = [...form.querySelectorAll('input, textarea')];
  const touched = new WeakSet();

  form.noValidate = true;

  for (const field of fields) {
    field.addEventListener('blur', () => {
      touched.add(field);
      validateField(field);
    });
    field.addEventListener('input', () => {
      if (touched.has(field) || field.hasAttribute('aria-invalid')) validateField(field);
    });
  }

  function setStatus(state, message) {
    formStatus.hidden = false;
    formStatus.dataset.state = state;
    formStatus.classList.toggle('form-status--error', state === 'error');
    formStatus.classList.toggle('form-status--success', state === 'success');
    formStatus.setAttribute('role', state === 'error' ? 'alert' : 'status');
    formStatus.textContent = message;
  }

  // Opens the visitor's email app with the enquiry prefilled. Nothing is sent
  // by this page, so the status says exactly that rather than claiming success.
  function openEmail() {
    const value = (name) => form.elements[name].value;
    const details = [
      `${contact.fieldLabels.name}: ${value('name')}`,
      `${contact.fieldLabels.email}: ${value('email')}`,
      value('phone') && `${contact.fieldLabels.phone}: ${value('phone')}`,
    ].filter(Boolean);
    const body = [value('message'), '', ...details].join('\n');
    const href = `mailto:${contact.emailTo}?subject=${encodeURIComponent(contact.emailSubject)}&body=${encodeURIComponent(body)}`;
    window.location.href = href;
    setStatus('info', contact.mailtoOpened);
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    for (const field of fields) field.value = field.value.trim();
    const valid = fields.map(validateField).every(Boolean);
    if (!valid) {
      setStatus('error', contact.validation.form);
      fields.find((field) => field.hasAttribute('aria-invalid'))?.focus();
      return;
    }

    if (!formEndpoint) {
      openEmail();
      return;
    }

    submit.disabled = true;
    submit.setAttribute('aria-busy', 'true');
    setStatus('sending', contact.sending);

    try {
      const response = await fetch(formEndpoint, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
        mode: 'cors',
        credentials: 'omit',
      });
      if (!response.ok) throw new Error(`Form service returned ${response.status}`);
      form.reset();
      for (const field of fields) {
        touched.delete(field);
        setFieldError(field, '');
      }
      setStatus('success', contact.sent);
    } catch {
      setStatus('error', contact.failed);
    } finally {
      submit.disabled = false;
      submit.removeAttribute('aria-busy');
    }
  });
}

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const hero = heroStage?.closest('.hero');
const heroInner = hero?.querySelector('.hero__inner');
const pager = document.querySelector('[data-hero-pager]');
const pageButtons = [...(pager?.querySelectorAll('[data-page-step]') ?? [])];
const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

// Scroll only opens and closes the book: while the hero is pinned, scrolling down
// opens the cover and scrolling back closes it. Pages turn only by hand: a click,
// a drag, the pager buttons or the audience switch. Turning a page while the book
// is closed opens it too; scrolling back up to the top closes it again.
let openedByHand = false;
let lastScrollOpen = 0;

function scrollOpen() {
  if (!hero.classList.contains('hero--scrub')) return 1;
  const rect = hero.getBoundingClientRect();
  const travel = rect.height - heroInner.offsetHeight;
  const progress = travel > 0 ? clamp(-rect.top / travel, 0, 1) : 1;
  // The last 15% of the pin rests on the open book before the page moves on.
  return Math.min(progress / 0.85, 1);
}

function syncBookState() {
  const spread = Math.round(albumController.spread);
  const open = albumController.opened > 0.5;
  pageButtons[0].disabled = !open || spread <= 0;
  pageButtons[1].disabled = open && spread >= albumController.lastSpread;
  canvas.setAttribute('aria-label', open ? content.hero.spreads[spread].alt : content.hero.fallbackAlt);
}

function followScroll({ immediate = false } = {}) {
  const open = scrollOpen();
  if (open < lastScrollOpen) openedByHand = false;
  lastScrollOpen = open;
  albumController.setOpen(openedByHand ? 1 : open, immediate ? { immediate } : undefined);
  syncBookState();
}

function openByHand() {
  if (albumController.opened >= 1) return;
  openedByHand = true;
  albumController.setOpen(1);
}

function goToSpread(index, options) {
  if (!albumController) return;
  openByHand();
  albumController.setSpread(index, options);
  syncBookState();
}

function step(direction) {
  if (albumController.opened < 1) { openByHand(); syncBookState(); return; }
  goToSpread(clamp(Math.round(albumController.spread) + direction, 0, albumController.lastSpread));
}

// Pointer: a click on the right half turns forward, on the left half back. A
// horizontal drag moves the pages 1:1 and, on release, projects the drag's velocity
// and settles on the nearest spread, carrying that velocity into the spring.
function enablePointerTurns() {
  let drag = null;
  const pageWidth = () => Math.max(heroStage.clientWidth * 0.4, 1);

  canvas.addEventListener('pointerdown', (event) => {
    if (event.button !== 0) return;
    drag = { id: event.pointerId, x: event.clientX, y: event.clientY, start: albumController.pagePosition, moved: false, lastX: event.clientX, lastTime: event.timeStamp, velocity: 0 };
  });

  canvas.addEventListener('pointermove', (event) => {
    if (!drag || event.pointerId !== drag.id || albumController.opened < 1) return;
    const dx = event.clientX - drag.x;
    if (!drag.moved) {
      if (Math.abs(dx) < 6) return;
      if (Math.abs(event.clientY - drag.y) > Math.abs(dx)) { drag = null; return; }
      drag.moved = true;
      canvas.setPointerCapture(event.pointerId);
      canvas.classList.add('is-dragging');
    }
    const elapsed = (event.timeStamp - drag.lastTime) / 1000;
    if (elapsed > 0) drag.velocity = -(event.clientX - drag.lastX) / pageWidth() / elapsed;
    drag.lastX = event.clientX;
    drag.lastTime = event.timeStamp;
    goToSpread(drag.start - dx / pageWidth(), { immediate: true });
  });

  const end = (event, cancelled) => {
    if (!drag || event.pointerId !== drag.id) return;
    const { moved, velocity } = drag;
    drag = null;
    canvas.classList.remove('is-dragging');
    if (moved) {
      const fling = clamp(velocity, -8, 8);
      const projected = albumController.pagePosition + fling * 0.15;
      goToSpread(clamp(Math.round(projected), 0, albumController.lastSpread), { velocity: fling });
    } else if (!cancelled) {
      const rect = heroStage.getBoundingClientRect();
      step(event.clientX > rect.left + rect.width / 2 ? 1 : -1);
    }
  };
  canvas.addEventListener('pointerup', (event) => end(event, false));
  canvas.addEventListener('pointercancel', (event) => end(event, true));
}

// Stretch the canvas from the stage out to the linen ground's edges (and the
// pinned hero's full height), so the background reaches the edge of the screen.
const backdrop = hero?.querySelector('.hero__backdrop');
function stretchCanvas() {
  const stage = heroStage.getBoundingClientRect();
  const ground = backdrop?.getBoundingClientRect();
  const inner = heroInner.getBoundingClientRect();
  const wide = ground && ground.width > 0;
  heroStage.style.setProperty('--canvas-left', `${wide ? ground.left - stage.left : 0}px`);
  heroStage.style.setProperty('--canvas-right', `${wide ? stage.right - ground.right : 0}px`);
  heroStage.style.setProperty('--canvas-top', `${wide ? inner.top - stage.top : 0}px`);
  // While pinned, the inner block is a header-height shorter than the screen; run
  // the canvas down to the screen's bottom edge so the orbits are not cut short.
  const header = hero.classList.contains('hero--scrub') ? hero.offsetTop : 0;
  heroStage.style.setProperty('--canvas-bottom', `${wide ? stage.bottom - inner.bottom - header : 0}px`);
}

async function startAlbumScene() {
  if (!canvas || !heroStage) return;
  if (!reducedMotion) hero.classList.add('hero--scrub');
  stretchCanvas();
  window.addEventListener('resize', stretchCanvas, { passive: true });
  try {
    const { openAlbumScene } = await import('./album-scene.js');
    albumController = await openAlbumScene(canvas, content.hero.spreads, {
      reducedMotion,
      onReady: () => {
        heroStage.dataset.modelReady = 'true';
        fallback.setAttribute('aria-hidden', 'true');
        canvas.setAttribute('aria-hidden', 'false');
      },
    });
    followScroll({ immediate: true });
    window.addEventListener('scroll', () => followScroll(), { passive: true });
    window.addEventListener('resize', () => followScroll(), { passive: true });
    for (const button of pageButtons) button.addEventListener('click', () => step(Number(button.dataset.pageStep)));
    pager.hidden = false;
    enablePointerTurns();
  } catch {
    hero.classList.remove('hero--scrub');
    heroStage.dataset.modelReady = 'false';
    canvas.setAttribute('aria-hidden', 'true');
    fallback.srcset = content.hero.openSrcset;
    fallback.src = content.hero.openImage;
    fallback.alt = content.hero.openAlt;
    fallback.removeAttribute('aria-hidden');
  }
}

startAlbumScene();
window.addEventListener('pagehide', () => albumController?.dispose(), { once: true });

// Once-only section reveals. Elements are visible by default; JS marks them as
// pending only when motion is allowed, and each reveals the first time it enters
// view. Stagger is per section and capped so a group finishes inside 500 ms.
const revealTargets = [
  '.section-heading', '.product-item', '.materials-detail', '.material-selector',
  '.process-step', '.process-image', '.service-item', '.editing-demo',
  '.options-table-wrap', '.options-note', '.options-cta', '.contact-methods', '.contact-form',
  '.footer-main > *',
];

if (!reducedMotion && 'IntersectionObserver' in window) {
  html.classList.add('js');
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('is-revealed');
      observer.unobserve(entry.target);
    }
  }, { rootMargin: '0px 0px -10% 0px' });

  for (const section of document.querySelectorAll('main > section:not(.hero), .site-footer')) {
    const items = section.querySelectorAll(revealTargets.join(', '));
    items.forEach((item, index) => {
      item.dataset.reveal = '';
      item.style.setProperty('--reveal-i', String(Math.min(index, 5)));
      observer.observe(item);
    });
  }
}
