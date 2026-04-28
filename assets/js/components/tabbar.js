const TabBar = (() => {
  const ICONS = {
    board: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>',
    list: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 7h18M3 12h18M3 17h18"/><circle cx="3" cy="7" r="0.5" fill="currentColor"/><circle cx="3" cy="12" r="0.5" fill="currentColor"/><circle cx="3" cy="17" r="0.5" fill="currentColor"/></svg>',
    mine: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 4-7 8-7s8 3 8 7"/></svg>'
  };

  const TABS = [
    { key: 'board', label: '看板', icon: ICONS.board, href: 'sales-board.html' },
    { key: 'list', label: '酒店', icon: ICONS.list, href: 'hotel-list.html' },
    { key: 'mine', label: '我的', href: 'mine.html', icon: ICONS.mine }
  ];

  const render = (selector, options = {}) => {
    const { active = '' } = options;
    const el = document.querySelector(selector);
    if (!el) return;

    const isInPages = window.location.pathname.includes('/pages/');
    const prefix = isInPages ? '' : 'pages/';

    el.innerHTML = `
      <nav class="app-tabbar">
        ${TABS.map(tab => `
          <a class="app-tabbar__item ${tab.key === active ? 'app-tabbar__item--active' : ''}"
             href="${prefix}${tab.href}">
            ${tab.icon}
            <span class="app-tabbar__label">${tab.label}</span>
          </a>
        `).join('')}
      </nav>
    `;
  };

  return { render };
})();
