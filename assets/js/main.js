(() => {
  let SITE_DATA = {
    projects: [],
    opensource: [],
    timeline: [],
    skills: [],
    contact: [],
  };

  function getBasePath() {
    const scripts = document.getElementsByTagName('script');
    for (const script of scripts) {
      const src = script.getAttribute('src');
      if (src && src.includes('assets/js/main.js')) {
        return src.replace('assets/js/main.js', '');
      }
    }
    return '';
  }

  const BASE = getBasePath();

  async function fetchJSON(path) {
    const res = await fetch(`${BASE}${path}?t=${Date.now()}`);
    if (!res.ok) throw new Error(`Failed to fetch ${path}: ${res.status}`);
    return res.json();
  }

  async function loadSiteData() {
    try {
      const [projects, opensource, timeline, skills, contact] = await Promise.all([
        fetchJSON('data/projects.json'),
        fetchJSON('data/opensource.json'),
        fetchJSON('data/timeline.json'),
        fetchJSON('data/skills.json'),
        fetchJSON('data/contact.json'),
      ]);
      SITE_DATA = { projects, opensource, timeline, skills, contact };
      console.log('[main] Site data loaded');
      renderAll();
    } catch (err) {
      console.error('[main] Failed to load site data:', err);
    }
  }

  function qs(selector, root = document) {
    return root.querySelector(selector);
  }

  function qsa(selector, root = document) {
    return Array.from(root.querySelectorAll(selector));
  }

  function clear(el) {
    if (!el) return;
    el.innerHTML = '';
  }

  function t(key) {
    return window.i18n?.get ? window.i18n.get(key) : key;
  }

  function renderSpanTags(tags, className) {
    if (!Array.isArray(tags)) return '';
    return tags.map((tag) => `<span class="${className}">${tag}</span>`).join('');
  }

  function renderProjectTags(tags) {
    if (!Array.isArray(tags)) return '';
    return `<div class="project-tags">${renderSpanTags(tags, 'project-tag')}</div>`;
  }

  function initThemeToggle() {
    const toggleBtn = qs('.theme-toggle');
    const htmlEl = document.documentElement;
    if (!toggleBtn) return;

    const savedTheme = localStorage.getItem('theme') || 'light';
    htmlEl.setAttribute('data-theme', savedTheme);

    toggleBtn.addEventListener('click', () => {
      const currentTheme = htmlEl.getAttribute('data-theme');
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      htmlEl.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
    });
  }

  function initLangToggle() {
    const toggleBtn = qs('.lang-toggle');
    if (!toggleBtn) return;

    toggleBtn.addEventListener('click', () => {
      const current = window.i18n.currentLang();
      const next = current === 'en' ? 'zh' : 'en';
      window.i18n.changeLang(next);
    });
  }

  function initProjects() {
    const grid = qs('.projects-grid');
    if (!grid) return;
    clear(grid);

    SITE_DATA.projects.forEach((project) => {
      const tagsHtml = renderProjectTags(project.tags);
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <div class="project-thumbnail-wrapper">
          <img src="${project.img}" alt="${t('projects.imgAlt')}" class="project-thumbnail">
        </div>
        <div class="project-info">
          <h3>${t(project.titleKey)}</h3>
          <p>${t(project.descKey)}</p>
          ${tagsHtml}
          <a href="${project.link}" class="project-link">${t('projects.viewDetail')}</a>
        </div>
      `;
      grid.appendChild(card);
    });
  }

  function initOpenSource() {
    const grid = qs('.opensource-grid');
    if (!grid) return;
    clear(grid);

    SITE_DATA.opensource.forEach((item) => {
      const tags = t(`${item.key}.tags`) || [];
      const tagsHtml = renderSpanTags(tags, 'os-tag');

      let buttonsHtml = '';
      if (item.linkCode) {
        buttonsHtml += `<a href="${item.linkCode}" target="_blank" rel="noopener noreferrer" class="os-btn"><i class="fab fa-github"></i> ${t('opensource.btnCode')}</a>`;
      }
      if (item.linkDoc) {
        buttonsHtml += `<a href="${item.linkDoc}" target="_blank" rel="noopener noreferrer" class="os-btn"><i class="fas fa-book"></i> ${t('opensource.btnDoc')}</a>`;
      }

      const card = document.createElement('div');
      card.className = 'os-card';
      card.innerHTML = `
        <div class="os-header">
          <div class="os-title">${t(`${item.key}.title`)}</div>
          <i class="fas fa-code-branch" style="color:var(--primary); opacity:0.5;"></i>
        </div>
        <p class="os-desc">${t(`${item.key}.desc`)}</p>
        <div class="os-tags">${tagsHtml}</div>
        <div class="os-actions">${buttonsHtml}</div>
      `;
      grid.appendChild(card);
    });
  }

  function initTimeline() {
    const container = qs('.timeline-container');
    if (!container) return;
    clear(container);

    SITE_DATA.timeline.forEach((key) => {
      const item = document.createElement('div');
      item.className = 'timeline-item';
      item.innerHTML = `
        <div class="timeline-dot"></div>
        <span class="timeline-date">${t(`${key}.date`)}</span>
        <div class="timeline-content">
          <h3>${t(`${key}.title`)}</h3>
          <p>${t(`${key}.desc`)}</p>
        </div>
      `;
      container.appendChild(item);
    });
  }

  function initTechStack() {
    const container = qs('.skills-wrapper');
    if (!container) return;
    clear(container);

    SITE_DATA.skills.forEach((group) => {
      const itemsHtml = group.items
        .map((s) => `<div class="skill-badge"><i class="${s.icon}"></i> ${s.name}</div>`)
        .join('');

      const col = document.createElement('div');
      col.className = 'skill-category';
      col.innerHTML = `<h3>${t(group.category)}</h3><div class="skill-list">${itemsHtml}</div>`;
      container.appendChild(col);
    });
  }

  function initContactLinks() {
    const container = qs('.intro-contact-links');
    if (!container) return;
    clear(container);

    SITE_DATA.contact.forEach((contact) => {
      const label = t(contact.key);
      const item = document.createElement('a');
      item.className = 'intro-contact-link';
      item.href = contact.link;
      item.target = '_blank';
      item.rel = 'noopener noreferrer';
      item.title = label;
      item.setAttribute('aria-label', label);
      item.innerHTML = `<i class="${contact.icon}"></i>`;
      container.appendChild(item);
    });
  }

  function initSmoothScroll() {
    qsa('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const href = this.getAttribute('href');
        if (!href || href === '#') return;

        let target;
        try {
          target = qs(href);
        } catch {
          return;
        }

        if (target) {
          window.scrollTo({
            top: target.offsetTop - 80,
            behavior: 'smooth',
          });
        }
      });
    });
  }

  function initRevealMotion() {
    const targets = [
      ...qsa('.project-detail-card'),
      ...qsa('.projects-grid .card'),
      ...qsa('.opensource-grid .os-card'),
      ...qsa('.timeline-container .timeline-item'),
      ...qsa('.skills-wrapper .skill-category'),
    ];

    if (!targets.length) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    targets.forEach((el, index) => {
      el.classList.add('reveal');
      el.style.setProperty('--reveal-delay', `${(index % 6) * 60}ms`);
    });

    if (reducedMotion || typeof IntersectionObserver === 'undefined') {
      targets.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -8% 0px',
      },
    );

    targets.forEach((el) => observer.observe(el));
  }

  function renderAll() {
    initProjects();
    initOpenSource();
    initTimeline();
    initTechStack();
    initContactLinks();
    initRevealMotion();
  }

  document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    initLangToggle();
    initSmoothScroll();
  });

  window.addEventListener('i18nLoaded', () => {
    console.log('[main] i18n loaded, loading site data...');
    loadSiteData();
  });
})();
