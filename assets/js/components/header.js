const Header = (() => {
  const BACK_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M15 18l-6-6 6-6"/></svg>';

  const render = (selector, options = {}) => {
    const { title = '', showBack = false, backHref = '', actions = '' } = options;
    const el = document.querySelector(selector);
    if (!el) return;

    const backAction = backHref ? `window.location.href='${backHref}'` : 'history.back()';

    el.innerHTML = `
      <div class="app-header">
        ${showBack ? `<div class="app-header__back" onclick="${backAction}">${BACK_SVG}</div>` : ''}
        <div class="app-header__title">${title}</div>
        <div class="app-header__action">${actions}</div>
      </div>
    `;

    const content = document.querySelector('.page-content');
    if (content) content.classList.add('page-content--with-header');
  };

  return { render };
})();
