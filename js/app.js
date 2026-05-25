/* B站视频导引网站 - 单页路由 */
const App = {
  current: 'login',
  titles: {
    login: '登录 - B站视频导引网站',
    home: '首页 - B站视频导引网站',
    nav: 'B站视频导航',
    video: '【教程】Python入门到精通',
    profile: '个人中心',
    search: '搜索结果',
    upload: 'B视频上传'
  },

  init() {
    const hash = location.hash.slice(1);
    if (hash && this.titles[hash]) this.go(hash, false);

    document.addEventListener('click', e => {
      const el = e.target.closest('[data-nav]');
      if (!el) return;
      e.preventDefault();
      const page = el.dataset.nav;
      if (page === 'search' && el.closest('form')) {
        const input = el.closest('form').querySelector('input');
        if (input?.value.trim()) {
          const si = document.querySelector('#page-search .search-input-wrap input');
          if (si) si.value = input.value.trim();
        }
      }
      this.go(page);
    });

    document.getElementById('login-form')?.addEventListener('submit', e => {
      e.preventDefault();
      this.go('home');
    });

    document.querySelector('.search-bar-nav')?.addEventListener('submit', e => {
      e.preventDefault();
      const v = e.target.querySelector('input')?.value.trim();
      if (v) {
        const si = document.querySelector('#page-search .search-input-wrap input');
        if (si) si.value = v;
      }
      this.go('search');
    });

    window.addEventListener('hashchange', () => {
      const h = location.hash.slice(1);
      if (h && this.titles[h] && h !== this.current) this.go(h, false);
    });

    this.bindTabs();
    this.bindUpload();
  },

  go(page, pushHash = true) {
    if (!this.titles[page]) return;
    this.current = page;
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById('page-' + page)?.classList.add('active');

    document.title = this.titles[page];
    if (pushHash) location.hash = page;
    window.scrollTo(0, 0);
  },

  bindTabs() {
    document.querySelectorAll('.category-bar .pill').forEach(pill => {
      pill.addEventListener('click', e => {
        if (pill.dataset.nav) return;
        e.preventDefault();
        document.querySelectorAll('#page-home .category-bar .pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
      });
    });

    document.querySelectorAll('.search-tabs-row .tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.search-tabs-row .tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
      });
    });

    document.querySelectorAll('.rank-tabs span').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.rank-tabs span').forEach(t => {
          t.classList.remove('active');
          t.textContent = t.textContent.replace('● ', '');
        });
        tab.classList.add('active');
        if (!tab.textContent.startsWith('●')) tab.textContent = '● ' + tab.textContent.trim();
      });
    });

    document.querySelectorAll('.pagination .page-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.textContent.match(/^\d+$/)) {
          btn.closest('.pagination')?.querySelectorAll('.page-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
        }
      });
    });
  },

  bindUpload() {
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    if (!dropZone || !fileInput) return;

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(evt => {
      dropZone.addEventListener(evt, e => { e.preventDefault(); e.stopPropagation(); });
    });
    dropZone.addEventListener('dragover', () => dropZone.style.borderColor = 'var(--bili-blue)');
    dropZone.addEventListener('dragleave', () => dropZone.style.borderColor = '#d0d0d0');
    dropZone.addEventListener('drop', e => {
      dropZone.style.borderColor = '#d0d0d0';
      const files = e.dataTransfer.files;
      if (files.length) alert('已选择文件: ' + files[0].name);
    });
    fileInput.addEventListener('change', () => {
      if (fileInput.files.length) alert('已选择文件: ' + fileInput.files[0].name);
    });
    document.querySelector('.btn-select')?.addEventListener('click', () => fileInput.click());
  }
};

document.addEventListener('DOMContentLoaded', () => App.init());
