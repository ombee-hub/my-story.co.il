// Sticky nav border on scroll
const nav = document.getElementById('nav');
if (nav) {
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 8);
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();
}

// Mobile menu — side panel
const toggle = document.getElementById('navToggle');
const links = document.getElementById('navLinks');
if (toggle && links) {
  // Inject backdrop
  const backdrop = document.createElement('div');
  backdrop.className = 'nav-backdrop';
  document.body.appendChild(backdrop);

  // Inject close button (X)
  const closeBtn = document.createElement('button');
  closeBtn.className = 'nav-close';
  closeBtn.setAttribute('aria-label', 'סגירה');
  closeBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>';
  links.prepend(closeBtn);

  // Inject brand header at top of panel
  const brandHeader = document.createElement('div');
  brandHeader.className = 'nav-panel-brand';
  brandHeader.innerHTML = `
    <img src="images/mystory-logo.webp" alt="" />
    <div>
      <b>בשביל המילים</b>
      <span>סמדר ויצמן · סיפורולוגית</span>
    </div>
  `;
  closeBtn.after(brandHeader);

  // Inject footer with contact info + social icons
  const footer = document.createElement('div');
  footer.className = 'nav-panel-footer';
  footer.innerHTML = `
    <div class="nav-panel-contact">
      <a href="tel:0506596019">050-659-6019</a>
      <a href="mailto:smadar@my-story.co.il">smadar@my-story.co.il</a>
    </div>
    <div class="nav-panel-social">
      <a href="https://www.facebook.com/SmadarStory" target="_blank" rel="noopener" aria-label="Facebook">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
      </a>
      <a href="https://www.youtube.com/@SmadarWeizman" target="_blank" rel="noopener" aria-label="YouTube">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
      </a>
    </div>
  `;
  links.append(footer);

  const openMenu = () => {
    links.classList.add('open');
    backdrop.classList.add('open');
    document.body.classList.add('nav-open');
  };
  const closeMenu = () => {
    links.classList.remove('open');
    backdrop.classList.remove('open');
    document.body.classList.remove('nav-open');
  };
  const toggleMenu = () => {
    links.classList.contains('open') ? closeMenu() : openMenu();
  };

  toggle.addEventListener('click', toggleMenu);
  closeBtn.addEventListener('click', closeMenu);

  // Close when clicking a link (navigation)
  links.addEventListener('click', e => {
    if (e.target.tagName === 'A' || e.target.closest('a')) closeMenu();
  });

  // Close on ESC key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && links.classList.contains('open')) closeMenu();
  });
}

// FAQ accordion
document.querySelectorAll('.faq-item').forEach(item => {
  const btn = item.querySelector('button');
  const ans = item.querySelector('.faq-answer');
  if (!btn || !ans) return;
  btn.addEventListener('click', () => {
    const isOpen = item.classList.toggle('open');
    ans.style.maxHeight = isOpen ? ans.scrollHeight + 40 + 'px' : '0';
  });
});

// Reveal on scroll
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      io.unobserve(e.target);
    }
  });
}, {threshold: 0.12});
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// Form (placeholder — replace with real submit handler)
function handleSubmit(e){
  e.preventDefault();
  const btn = e.target.querySelector('button');
  btn.textContent = 'נשלח · תודה!';
  btn.style.background = 'var(--btn-hover)';
  e.target.reset();
  setTimeout(() => { btn.textContent = 'שלח/י הודעה'; btn.style.background = ''; }, 4000);
}

// =========================================
// BOOKS DROPDOWN — wraps the "ספרים" nav link with a dropdown
// =========================================
(() => {
  const navLinks = document.getElementById('navLinks');
  if (!navLinks) return;

  // Find the books link
  const allLinks = Array.from(navLinks.querySelectorAll('a'));
  const booksLink = allLinks.find(a => {
    const href = a.getAttribute('href') || '';
    return href === 'books.html' || href === '../books.html';
  });
  if (!booksLink) return;

  // Detect path context (root or books/ subfolder)
  const inBooksFolder = /\/books\/[^/]+\.html$/.test(window.location.pathname);
  const dataPrefix = inBooksFolder ? '../' : '';
  const linkPrefix = inBooksFolder ? '' : 'books/';

  // Wrap link in dropdown container
  const dropdown = document.createElement('div');
  dropdown.className = 'nav-dropdown';
  booksLink.parentNode.insertBefore(dropdown, booksLink);
  booksLink.classList.add('nav-dropdown-link');

  // Move link into dropdown
  dropdown.appendChild(booksLink);

  // Add toggle button (chevron) — separate so mobile can tap it
  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'nav-dropdown-toggle';
  toggle.setAttribute('aria-label', 'הצג רשימת ספרים');
  toggle.innerHTML = `<svg class="nav-dropdown-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>`;
  dropdown.appendChild(toggle);

  // Add dropdown menu (will be populated after data loads)
  const menu = document.createElement('div');
  menu.className = 'nav-dropdown-menu';
  dropdown.appendChild(menu);

  // Toggle click → open/close dropdown
  toggle.addEventListener('click', e => {
    e.preventDefault();
    e.stopPropagation();
    dropdown.classList.toggle('open');
  });

  // Click outside closes
  document.addEventListener('click', e => {
    if (!dropdown.contains(e.target)) dropdown.classList.remove('open');
  });
  // ESC key closes
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') dropdown.classList.remove('open');
  });

  // Load books data and populate
  const populateMenu = () => {
    if (!window.BOOKS_DATA) return;
    menu.innerHTML = `
      <div class="nav-dropdown-card">
        <div class="nav-dropdown-header">
          <span class="eyebrow">סיפורי חיים</span>
        </div>
        <div class="nav-dropdown-list"></div>
        <div class="nav-dropdown-footer">
          <a href="${inBooksFolder ? '../books.html' : 'books.html'}">
            <span>לכל הספרים</span>
          </a>
        </div>
      </div>
    `;
    const list = menu.querySelector('.nav-dropdown-list');
    window.BOOKS_DATA.forEach(book => {
      const link = document.createElement('a');
      link.href = `${linkPrefix}${book.id}.html`;
      link.textContent = book.title;
      list.appendChild(link);
    });
  };

  if (window.BOOKS_DATA) {
    populateMenu();
  } else {
    const script = document.createElement('script');
    script.src = `${dataPrefix}assets/books-data.js`;
    script.onload = populateMenu;
    document.head.appendChild(script);
  }
})();
