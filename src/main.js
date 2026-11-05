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
  canvas.setAttribute('aria-label', next.canvasAlt);
  html.dataset.audience = next.id;

  for (const button of audienceButtons) {
    const selected = button.dataset.audienceChoice === next.id;
    button.classList.toggle('is-selected', selected);
    button.setAttribute('aria-pressed', String(selected));
  }

  albumController?.setPageImages(next.pageImages);
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

async function startAlbumScene() {
  if (!canvas || !heroStage) return;
  try {
    const { openAlbumScene } = await import('./album-scene.js');
    albumController = await openAlbumScene(canvas, currentAudience.pageImages, {
      reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      onReady: () => {
        heroStage.dataset.modelReady = 'true';
        fallback.setAttribute('aria-hidden', 'true');
        canvas.setAttribute('aria-hidden', 'false');
      },
    });
  } catch {
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
