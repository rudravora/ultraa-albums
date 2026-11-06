import { readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { content as c } from '../src/content.js';

const root = process.cwd();
const html = (value = '') => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');

function loadPublicEndpoint() {
  if (process.env.VITE_ULTRAA_FORM_ENDPOINT?.trim()) return process.env.VITE_ULTRAA_FORM_ENDPOINT.trim();
  for (const file of ['.env.production.local', '.env.local', '.env.production', '.env']) {
    const path = resolve(root, file);
    if (!existsSync(path)) continue;
    const text = readFile(path, 'utf8');
    return text.then((contents) => {
      for (const line of contents.split(/\r?\n/)) {
        const match = line.match(/^\s*(?:export\s+)?VITE_ULTRAA_FORM_ENDPOINT\s*=\s*(.*?)\s*$/);
        if (!match) continue;
        const value = match[1].replace(/\s+#.*$/, '').replace(/^(["'])(.*)\1$/, '$2').trim();
        if (value) return value;
      }
      return '';
    });
  }
  return Promise.resolve('');
}

function safeEndpoint(value) {
  try {
    const url = new URL(value);
    return ['https:', 'http:'].includes(url.protocol) ? url.toString() : '';
  } catch {
    return '';
  }
}

function responsiveImage(path, alt, { className = '', sizes = '(max-width: 640px) 100vw, 50vw', loading = 'lazy', width = 800, height = 1000, fetchPriority = '' } = {}) {
  const variants = [480, 800, 1200]
    .map((size) => `${html(path.replace(/-800\.webp$/, `-${size}.webp`))} ${size}w`)
    .join(', ');
  const priority = fetchPriority ? ` fetchpriority="${html(fetchPriority)}"` : '';
  return `<img class="${html(className)}" src="${html(path)}" srcset="${variants}" sizes="${html(sizes)}" width="${width}" height="${height}" alt="${html(alt)}" loading="${html(loading)}" decoding="async"${priority}>`;
}

function productMenu() {
  return `<details class="nav-products" id="products-menu">
    <summary>Products</summary>
    <div class="nav-products__panel" id="products-panel">
      <nav aria-label="Album products">
        ${c.productsMenu.map((item) => `<a href="${html(item.href)}">${html(item.label)}</a>`).join('')}
      </nav>
    </div>
  </details>`;
}

function primaryLinks(className = '') {
  return `<nav class="${html(className)}" aria-label="Primary navigation">
    ${c.navigation.map((item) => `<a href="${html(item.href)}">${html(item.label)}</a>`).join('')}
  </nav>`;
}

function productItem(item, index) {
  const wide = index === 0 || index === 3 ? ' product-item--wide' : '';
  return `<article class="product-item${wide}">
    <a class="product-item__link" href="${html(item.href)}">
      <span class="product-item__image" style="--photo-ratio:${html(item.ratio)}">
        ${responsiveImage(item.image, '', { className: 'product-item__photo', sizes: '(max-width: 640px) 50vw, (max-width: 1024px) 44vw, 42vw' })}
      </span>
      <span class="product-item__text">
        <span class="product-item__heading">${html(item.title)}</span>
        <span class="product-item__description">${html(item.description)}</span>
        <span class="text-link">${html(item.action)}</span>
      </span>
    </a>
  </article>`;
}

function materialChoice(item, index) {
  return `<button class="material-choice${index === 0 ? ' is-selected' : ''}" type="button" data-material="${html(item.id)}" aria-pressed="${index === 0}" aria-label="${html(item.label)}">
    <span class="material-choice__sample" aria-hidden="true"></span>
    <span>${html(item.label)}</span>
  </button>`;
}

function processStep(item) {
  return `<li class="process-step">
    <h3>${html(item.title)}</h3>
    <p>${html(item.description)}</p>
  </li>`;
}

function serviceItem(item) {
  return `<li class="service-item">
    <div>
      <h3>${html(item.title)}</h3>
      <p>${html(item.description)}</p>
    </div>
    <a class="text-link" href="${html(item.href)}">${html(item.action)}</a>
  </li>`;
}

function tableRow(row) {
  const cells = [row.sizes, row.covers, row.pages];
  const labels = c.sections.packages.columns.slice(1);
  return `<tr>
    <th scope="row">${html(row.format)}</th>
    ${cells.map((value, index) => `<td><span class="table-cell-label" aria-hidden="true">${html(labels[index])}</span>${html(value)}</td>`).join('')}
  </tr>`;
}

function linkList(items) {
  return `<ul>${items.map((item) => `<li><a href="${html(item.href)}">${html(item.label)}</a></li>`).join('')}</ul>`;
}

const endpointValue = await loadPublicEndpoint();
const endpoint = safeEndpoint(endpointValue);
if (endpointValue && !endpoint) console.warn('VITE_ULTRAA_FORM_ENDPOINT is not an http(s) URL; the form falls back to email.');
// Without an endpoint the form still works: a native mailto: action opens the
// visitor's email app (JS replaces this with a cleaner prefilled message).
const mailto = `mailto:${c.sections.contact.emailTo}?subject=${encodeURIComponent(c.sections.contact.emailSubject)}`;

const h = `<!doctype html>
<html lang="en" data-type="product" data-radius="soft" data-buttons="solid">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="page-type" content="product">
  <meta name="site-kind" content="other">
  <meta name="color-scheme" content="light">
  <meta name="theme-color" content="${html(c.meta.themeColor)}">
  <title>${html(c.meta.title)}</title>
  <meta name="description" content="${html(c.meta.description)}">
  <link rel="icon" type="image/png" href="${html(c.brand.logo)}">
  <link rel="preload" href="/assets/fonts/display.woff2" as="font" type="font/woff2" crossorigin="anonymous">
  <link rel="preload" href="/assets/fonts/sans.woff2" as="font" type="font/woff2" crossorigin="anonymous">
  <link rel="preload" as="image" href="${html(c.hero.fallbackImage)}" imagesrcset="${html(c.hero.fallbackSrcset)}" imagesizes="(max-width: 75rem) 100vw, 75rem" fetchpriority="high">
  <link rel="stylesheet" href="/src/site.css">
</head>
<body>
  <a class="skip-link" href="#main-content">Skip to content</a>
  <div class="top-bar">
    <div class="site-container top-bar__row">
      <p class="top-bar__fact">${html(c.hero.fact)}</p>
      <div class="top-bar__links">
        <a href="${html(c.sections.contact.phoneHref)}"><svg viewBox="0 0 20 20" aria-hidden="true" focusable="false"><path d="M6.6 3.5H4.4a1 1 0 0 0-1 1.1 13 13 0 0 0 12 12 1 1 0 0 0 1.1-1v-2.2a1 1 0 0 0-.8-1l-2.6-.6a1 1 0 0 0-1 .3l-1 1.1a10 10 0 0 1-4.1-4.1l1.1-1a1 1 0 0 0 .3-1l-.6-2.6a1 1 0 0 0-1-.8Z" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/></svg>${html(c.sections.contact.phoneLabel)}</a>
        <a class="top-bar__secondary" href="${html(c.sections.contact.emailHref)}">${html(c.sections.contact.emailTo)}</a>
        <a class="top-bar__secondary" href="${html(c.external.payOnline)}">Pay online<svg viewBox="0 0 20 20" aria-hidden="true" focusable="false"><path d="M7 13 13 7M8 7h5v5" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg></a>
      </div>
    </div>
  </div>
  <header class="site-header" id="top">
    <div class="site-container header-row">
      <a class="brand" href="${html(c.brand.home)}" aria-label="${html(c.brand.name)} home">
        <img src="${html(c.brand.logo)}" alt="${html(c.brand.logoAlt)}" width="213" height="71">
      </a>
      <div class="desktop-nav-area">
        <div class="desktop-navigation">
          ${productMenu()}
          ${primaryLinks('nav-links')}
        </div>
        <a class="button button--primary header-cta" href="#contact">${html(c.actions.primary)}</a>
      </div>
      <a class="button button--primary header-cta header-cta--compact" href="#contact">${html(c.actions.primary)}</a>
      <details class="mobile-menu" id="mobile-menu">
        <summary class="mobile-menu__trigger">Menu</summary>
        <div class="mobile-menu__panel">
          <div class="mobile-menu__top">
            <a class="brand brand--menu" href="${html(c.brand.home)}" aria-label="${html(c.brand.name)} home">
              <img src="${html(c.brand.logo)}" alt="" width="213" height="71">
            </a>
            <button class="mobile-menu__close" type="button" data-menu-close>Close menu</button>
          </div>
          <nav class="mobile-menu__links" aria-label="Mobile navigation">
            <a href="#products">Products</a>
            ${c.navigation.map((item) => `<a href="${html(item.href)}">${html(item.label)}</a>`).join('')}
          </nav>
          <div class="mobile-menu__actions">
            <a class="button button--primary" href="#contact">${html(c.actions.primary)}</a>
            <a class="utility-link" href="${html(c.external.payOnline)}">Pay online</a>
          </div>
        </div>
      </details>
    </div>
  </header>
  <main id="main-content">
    <section class="hero section" aria-labelledby="hero-title">
      <div class="hero__backdrop" aria-hidden="true"></div>
      <div class="site-container hero__inner">
        <div class="hero__intro">
          <div class="hero__headline">
            <div class="audience-switch" role="group" aria-label="${html(c.hero.audienceControl)}">
              ${c.hero.audiences.map((audience, index) => `<button type="button" class="audience-switch__choice${index === 0 ? ' is-selected' : ''}" data-audience-choice="${html(audience.id)}" aria-pressed="${index === 0}">${html(audience.label)}</button>`).join('')}
            </div>
            <h1 id="hero-title" data-hero-title>${html(c.hero.audiences[0].title)} <span class="hero__accent">${html(c.hero.audiences[0].accent)}</span></h1>
            <p class="hero__sentence" data-hero-sentence>${html(c.hero.audiences[0].sentence)}</p>
          </div>
          <div class="hero__actions">
            <div class="action-row">
              <a class="button button--primary" href="#contact">${html(c.actions.primary)}</a>
              <a class="button button--secondary" href="#contact">${html(c.actions.secondary)}</a>
            </div>
          </div>
        </div>
        <figure class="hero-stage" data-hero-stage>
          <img class="hero-stage__fallback" data-hero-fallback src="${html(c.hero.fallbackImage)}" srcset="${html(c.hero.fallbackSrcset)}" sizes="(max-width: 75rem) 100vw, 75rem" width="1400" height="1159" alt="${html(c.hero.fallbackAlt)}" loading="eager" fetchpriority="high" decoding="async">
          <canvas class="hero-stage__canvas" data-hero-canvas aria-hidden="true" role="img" aria-label="${html(c.hero.spreads[0].alt)}"></canvas>
          <div class="hero-pager" data-hero-pager hidden>
            <p class="hero-pager__hint">${html(c.hero.turnHint)}</p>
            <div class="hero-pager__controls">
              <button class="hero-pager__button" type="button" data-page-step="-1" aria-label="${html(c.hero.previousPage)}"><svg viewBox="0 0 20 20" aria-hidden="true" focusable="false"><path d="M12.5 4.5 7 10l5.5 5.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
              ${c.hero.spreads.map((_, index) => `<button class="hero-pager__spread" type="button" data-spread-index="${index}" aria-label="${html(c.hero.spreadLabel)} ${String(index + 1).padStart(2, '0')}">${String(index + 1).padStart(2, '0')}</button>`).join('')}
              <button class="hero-pager__button" type="button" data-page-step="1" aria-label="${html(c.hero.nextPage)}"><svg viewBox="0 0 20 20" aria-hidden="true" focusable="false"><path d="M7.5 4.5 13 10l-5.5 5.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
            </div>
          </div>
        </figure>
      </div>
    </section>
    <section class="section section--products" id="products" aria-labelledby="products-heading">
      <div class="site-container">
        <div class="section-heading">
          <h2 id="products-heading">${html(c.sections.products.title)}</h2>
        </div>
        <div class="product-grid">
          ${c.sections.products.items.map(productItem).join('')}
        </div>
      </div>
    </section>
    <section class="section section--materials" id="materials" aria-labelledby="materials-heading">
      <div class="site-container materials-layout">
        <div class="materials-copy">
          <div class="section-heading section-heading--left">
            <h2 id="materials-heading">${html(c.sections.materials.title)}</h2>
            </div>
          <fieldset class="material-selector">
            <legend>${html(c.sections.materials.legend)}</legend>
            <div class="material-selector__choices">
              ${c.sections.materials.items.map(materialChoice).join('')}
            </div>
          </fieldset>
        </div>
        <div class="materials-detail">
          ${responsiveImage(c.sections.materials.items[0].image, c.sections.materials.items[0].alt, { className: 'materials-detail__image', sizes: '(max-width: 60rem) 100vw, 52vw' })}
        </div>
      </div>
    </section>
    <section class="section section--process" id="process" aria-labelledby="process-heading">
      <div class="site-container process-layout">
        <div class="process-copy">
          <div class="section-heading section-heading--left">
            <h2 id="process-heading">${html(c.sections.process.title)}</h2>
            <p>${html(c.sections.process.introduction)}</p>
          </div>
          <ol class="process-list">
            ${c.sections.process.steps.map(processStep).join('')}
          </ol>
        </div>
        <div class="process-image">
          ${responsiveImage(c.sections.process.image, c.sections.process.imageAlt, { sizes: '(max-width: 60rem) 100vw, 48vw', width: 800, height: 600 })}
        </div>
      </div>
    </section>
    <section class="section section--services" id="services" aria-labelledby="services-heading">
      <div class="site-container">
        <div class="section-heading">
          <h2 id="services-heading">${html(c.sections.services.title)}</h2>
        </div>
        <div class="services-layout">
          <ul class="services-list">
            ${c.sections.services.items.map(serviceItem).join('')}
          </ul>
          <div class="editing-demo" data-editing-demo>
            <div class="editing-demo__header">
              <fieldset class="example-selector">
                <legend>${html(c.sections.services.editControl)}</legend>
                <div class="example-selector__choices">
                  ${c.sections.services.examples.map((example, index) => `<button class="example-choice${index === 0 ? ' is-selected' : ''}" type="button" data-example="${html(example.id)}" aria-pressed="${index === 0}">${html(example.label)}</button>`).join('')}
                </div>
              </fieldset>
            </div>
            <div class="compare-labels" aria-hidden="true">
              <span>${html(c.sections.services.before)}</span>
              <span>${html(c.sections.services.after)}</span>
            </div>
            <div class="compare-frame" data-compare-frame style="--compare-position:50%">
              ${responsiveImage(c.sections.services.examples[0].after, `${c.sections.services.examples[0].alt} After editing.`, { className: 'compare-frame__after', sizes: '(max-width: 60rem) 100vw, 40rem' })}
              ${responsiveImage(c.sections.services.examples[0].before, '', { className: 'compare-frame__before', sizes: '(max-width: 60rem) 100vw, 40rem' })}
              <span class="compare-frame__divider" aria-hidden="true"></span>
            </div>
            <label class="compare-control" for="editing-range">${html(c.sections.services.editRange)}</label>
            <input class="compare-range" id="editing-range" type="range" min="0" max="100" step="1" value="50" aria-label="${html(c.sections.services.editRange)}">
          </div>
        </div>
      </div>
    </section>
    <section class="section section--packages" id="album-options" aria-labelledby="album-options-heading">
      <div class="site-container">
        <div class="section-heading">
          <h2 id="album-options-heading">${html(c.sections.packages.title)}</h2>
          <p>${html(c.sections.packages.introduction)}</p>
        </div>
        <div class="options-table-wrap" tabindex="0" role="region" aria-label="Album sizes, covers and page options">
          <table class="options-table">
            <thead><tr>${c.sections.packages.columns.map((label) => `<th scope="col">${html(label)}</th>`).join('')}</tr></thead>
            <tbody>${c.sections.packages.rows.map(tableRow).join('')}</tbody>
          </table>
        </div>
        <p class="options-note">${html(c.sections.packages.note)}</p>
        <a class="button button--secondary options-cta" href="#contact">${html(c.actions.secondary)}</a>
      </div>
    </section>
    <section class="section section--contact" id="contact" aria-labelledby="contact-heading">
      <div class="site-container contact-layout">
        <div class="contact-copy">
          <div class="section-heading section-heading--left">
            <h2 id="contact-heading">${html(c.sections.contact.title)}</h2>
            <p>${html(c.sections.contact.introduction)}</p>
          </div>
          <ul class="contact-methods">
            <li><a href="${html(c.sections.contact.phoneHref)}">${html(c.sections.contact.phoneLabel)}</a></li>
            <li><a href="${html(c.sections.contact.emailHref)}">${html(c.sections.contact.emailLabel)}</a></li>
            <li><a href="${html(c.sections.contact.messengerHref)}">${html(c.sections.contact.messengerLabel)}</a></li>
          </ul>
        </div>
        <form class="contact-form" id="contact-form" action="${html(endpoint || mailto)}" method="post" enctype="${endpoint ? 'multipart/form-data' : 'text/plain'}" data-endpoint-configured="${Boolean(endpoint)}">
          <div class="form-field">
            <label for="contact-name">${html(c.sections.contact.fieldLabels.name)}</label>
            <input id="contact-name" name="name" type="text" autocomplete="name" maxlength="100" aria-describedby="contact-name-error" required>
            <p class="field-error" id="contact-name-error" data-field-error="name" aria-live="polite"></p>
          </div>
          <div class="form-field">
            <label for="contact-email">${html(c.sections.contact.fieldLabels.email)}</label>
            <input id="contact-email" name="email" type="email" autocomplete="email" maxlength="254" aria-describedby="contact-email-error" required>
            <p class="field-error" id="contact-email-error" data-field-error="email" aria-live="polite"></p>
          </div>
          <div class="form-field">
            <label for="contact-phone">${html(c.sections.contact.fieldLabels.phone)}</label>
            <input id="contact-phone" name="phone" type="tel" autocomplete="tel" maxlength="40" aria-describedby="contact-phone-error">
            <p class="field-error" id="contact-phone-error" data-field-error="phone" aria-live="polite"></p>
          </div>
          <div class="form-field form-field--message">
            <label for="contact-message">${html(c.sections.contact.fieldLabels.message)}</label>
            <textarea id="contact-message" name="message" rows="4" maxlength="1200" aria-describedby="contact-message-error" required></textarea>
            <p class="field-error" id="contact-message-error" data-field-error="message" aria-live="polite"></p>
          </div>
          <p class="form-status" id="contact-status" data-state="idle" role="status" aria-live="polite" hidden></p>
          <div class="form-actions">
            <button class="button button--primary form-submit" type="submit"${endpoint ? '' : ' aria-describedby="contact-note"'}>${html(c.sections.contact.submit)}</button>
            ${endpoint ? '' : `<p class="form-note" id="contact-note">${html(c.sections.contact.mailtoNote)}</p>`}
          </div>
        </form>
      </div>
    </section>
  </main>
  <footer class="site-footer">
    <div class="site-container">
      <div class="footer-main">
        <div class="footer-brand-block">
          <a class="brand" href="${html(c.brand.home)}" aria-label="${html(c.brand.name)} home"><img src="${html(c.brand.logo)}" alt="${html(c.brand.logoAlt)}" width="213" height="71" loading="lazy"></a>
          <a class="catalog-link" href="${html(c.external.catalog)}" target="_blank" rel="noopener">Download the catalog</a>
        </div>
        <nav class="footer-group" aria-label="Album products">
          <h2>Products</h2>
          ${linkList(c.footer.productLinks)}
        </nav>
        <nav class="footer-group" aria-label="Album services">
          <h2>Services</h2>
          ${linkList(c.footer.serviceLinks)}
        </nav>
        <nav class="footer-group" aria-label="Company and support">
          <h2>Support</h2>
          ${linkList([
            { label: 'FAQ', href: c.external.faq },
            { label: 'Shipping', href: '#process' },
            { label: 'Journal', href: c.external.journal },
            { label: 'Contact', href: '#contact' },
            { label: 'Pay online', href: c.external.payOnline },
          ])}
        </nav>
        <nav class="footer-group" aria-label="Legal information">
          <h2>Legal</h2>
          ${linkList([
            { label: 'Privacy Policy', href: c.external.privacy },
            { label: 'Terms and Conditions', href: c.external.terms },
          ])}
        </nav>
      </div>
      <div class="footer-bottom">
        <p>© 2026 ${html(c.brand.name)}</p>
        <a href="${html(c.brand.home)}">${html(c.brand.name)}</a>
      </div>
    </div>
  </footer>
  <script type="module" src="/src/main.js"></script>
</body>
</html>
`;

await writeFile(resolve(root, 'index.html'), h, 'utf8');
