/* B站视频导引网站 - 路由、导引、真实播放 */
const App = {
  current: 'login',
  currentVideoId: 'v1',
  filterCategory: '全部',
  searchQuery: '',
  history: [],

  titles: {
    login: '登录 - B站视频导引网站',
    home: '首页 - B站视频导引网站',
    nav: 'B站视频导航',
    video: '视频播放',
    profile: '个人中心',
    search: '搜索结果',
    upload: 'B视频上传'
  },

  init() {
    this.parseHash();
    this.renderHome();
    this.renderSearch();
    this.renderNavGuide();
    this.bindEvents();
    this.bindGlobalNav();
    if (this.current !== 'login') this.go(this.current, false);
  },

  bindGlobalNav() {
    document.addEventListener('click', e => {
      const nav = e.target.closest('[data-nav]');
      if (!nav || e.target.closest('[data-video-id]')) return;
      const page = nav.dataset.nav;
      if (!page || !this.titles[page]) return;
      e.preventDefault();
      this.go(page);
    });
  },

  parseHash() {
    const raw = location.hash.slice(1);
    if (!raw) return;
    if (raw.startsWith('video/')) {
      this.currentVideoId = raw.split('/')[1] || 'v1';
      this.current = 'video';
    } else if (raw.startsWith('video')) {
      const q = new URLSearchParams(raw.split('?')[1] || '');
      if (q.get('id')) this.currentVideoId = q.get('id');
      this.current = 'video';
    } else if (this.titles[raw]) {
      this.current = raw;
    }
  },

  bindEvents() {
    document.getElementById('login-form')?.addEventListener('submit', e => {
      e.preventDefault();
      this.go('home');
    });

    document.querySelector('.search-bar-nav')?.addEventListener('submit', e => {
      e.preventDefault();
      const v = e.target.querySelector('input')?.value.trim();
      if (v) this.searchQuery = v;
      this.renderSearch();
      this.go('search');
    });

    document.getElementById('search-form')?.addEventListener('submit', e => {
      e.preventDefault();
      this.searchQuery = e.target.querySelector('input')?.value.trim() || '';
      this.renderSearch();
    });

    window.addEventListener('hashchange', () => {
      const prev = this.current;
      this.parseHash();
      if (this.current === 'video') this.loadPlayer(this.currentVideoId);
      if (this.current !== prev) this.go(this.current, false);
    });

    document.querySelectorAll('.navbar .nav-links a[data-cat]').forEach(a => {
      a.addEventListener('click', e => {
        e.preventDefault();
        this.filterCategory = a.dataset.cat;
        this.renderHome();
        this.go('home');
      });
    });

    document.getElementById('home-grid')?.addEventListener('click', e => this.handleCardClick(e));
    document.getElementById('search-grid')?.addEventListener('click', e => this.handleCardClick(e));
    document.getElementById('nav-guide')?.addEventListener('click', e => this.handleGuideClick(e));
    document.getElementById('rec-list')?.addEventListener('click', e => this.handleCardClick(e));

    document.querySelectorAll('#page-home .category-bar .pill').forEach(pill => {
      pill.addEventListener('click', () => {
        document.querySelectorAll('#page-home .category-bar .pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        const cat = pill.dataset.cat || '全部';
        this.filterCategory = cat === '首页' ? '全部' : cat;
        this.renderHome();
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

    document.querySelector('[data-action="history"]')?.addEventListener('click', () => this.showHistory());
    this.bindUpload();
  },

  handleCardClick(e) {
    const card = e.target.closest('[data-video-id]');
    if (!card) return;
    e.preventDefault();
    this.playVideo(card.dataset.videoId);
  },

  handleGuideClick(e) {
    const featured = e.target.closest('[data-video-id]');
    if (featured) {
      e.preventDefault();
      this.playVideo(featured.dataset.videoId);
      return;
    }
    const icon = e.target.closest('.icon-item[data-cat]');
    if (icon) {
      e.preventDefault();
      this.filterCategory = icon.dataset.cat;
      this.renderHome();
      this.go('home');
    }
  },

  getFilteredVideos() {
    let list = [...VIDEOS];
    if (this.filterCategory && this.filterCategory !== '全部' && this.filterCategory !== '首页') {
      list = list.filter(v => v.category === this.filterCategory);
    }
    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      list = list.filter(v =>
        v.title.toLowerCase().includes(q) ||
        v.up.toLowerCase().includes(q) ||
        v.category.toLowerCase().includes(q) ||
        (v.desc && v.desc.toLowerCase().includes(q))
      );
    }
    return list;
  },

  cardHtml(v) {
    const wide = v.wide ? ' wide' : '';
    const tags = (v.tags || []).map(t => {
      const cls = t === '合集' ? 'yellow' : 'blue';
      return `<span class="tag ${cls}">${t}</span>`;
    }).join('');
    const meta = v.wide
      ? `播放量 ${v.views} · ${v.date}`
      : v.views;
    return `
      <div class="video-card${wide}" data-video-id="${v.id}" role="button" tabindex="0">
        <div class="thumb">
          <img src="${v.poster}" alt="" loading="lazy">
          <span class="play-icon">▶</span>
          <span class="duration">${v.duration}</span>
        </div>
        <div class="info">
          <div class="title">${v.title}</div>
          ${tags ? `<div class="tags">${tags}</div>` : ''}
          <div class="meta">${meta}</div>
        </div>
      </div>`;
  },

  searchCardHtml(v) {
    return `
      <div class="search-card" data-video-id="${v.id}" role="button" tabindex="0">
        <div class="thumb">
          <img src="${v.poster}" alt="" loading="lazy">
          <span class="play">▶</span>
          <span class="time">${v.duration}</span>
        </div>
        <div class="title">${v.title}</div>
        <div class="uploader">
          <div class="mini-avatar"></div>${v.up}
          <span class="date">${v.date}</span>
        </div>
      </div>`;
  },

  renderHome() {
    const grid = document.getElementById('home-grid');
    if (!grid) return;
    const list = this.getFilteredVideos();
    grid.innerHTML = list.length
      ? list.map(v => this.cardHtml(v)).join('')
      : '<p class="empty-tip">该分类暂无视频，试试其他分类</p>';
  },

  renderSearch() {
    const grid = document.getElementById('search-grid');
    const count = document.getElementById('search-count');
    const input = document.getElementById('search-input');
    if (input && this.searchQuery) input.value = this.searchQuery;
    const list = this.getFilteredVideos();
    if (grid) {
      grid.innerHTML = list.length
        ? list.map(v => this.searchCardHtml(v)).join('')
        : '<p class="empty-tip">未找到相关视频</p>';
    }
    if (count) count.textContent = `共 ${list.length} 个结果`;
  },

  renderNavGuide() {
    const featured = document.getElementById('nav-featured');
    const subs = document.getElementById('nav-subs');
    if (featured) {
      const v = VIDEOS[0];
      featured.dataset.videoId = v.id;
      featured.innerHTML = `
        <img src="${v.poster}" alt="">
        <span class="playing-tag">点击播放</span>
        <span class="play-overlay">▶</span>`;
    }
    if (subs) {
      subs.innerHTML = VIDEOS.slice(1, 3).map(v => `
        <div class="sub-item" data-video-id="${v.id}">
          <div class="sub-thumb"><img src="${v.poster}" alt=""></div>
          <p>${v.title}</p>
        </div>`).join('');
    }
    document.querySelectorAll('#nav-guide .icon-item').forEach((el, i) => {
      const icons = Object.keys(GUIDE_MAP);
      const emoji = icons[i % icons.length];
      el.dataset.cat = GUIDE_MAP[emoji];
      el.title = `进入${GUIDE_MAP[emoji]}分类`;
    });
  },

  playVideo(id) {
    this.currentVideoId = id;
    this.addHistory(id);
    this.loadPlayer(id);
    this.go('video');
  },

  loadPlayer(id) {
    const v = getVideo(id);
    document.title = v.title + ' - B站视频导引';
    const player = document.getElementById('main-player');
    if (player) {
      player.pause();
      player.src = v.src;
      player.poster = v.poster;
      player.load();
    }
    const set = (sel, text) => {
      const el = document.querySelector(sel);
      if (el) el.textContent = text;
    };
    set('#player-title', v.title);
    set('#player-up', 'UP主：' + v.up);
    set('#player-views', '播放量：' + v.views);
    set('#player-danmaku', '弹幕量：' + v.danmaku);
    set('#player-desc', v.desc || '');
    const tagEl = document.getElementById('player-tags');
    if (tagEl) {
      tagEl.innerHTML = (v.tags || []).map(t => `<span class="danmaku-tag">#${t}</span>`).join('');
    }
    this.renderRelated(v);
  },

  renderRelated(v) {
    const list = document.getElementById('rec-list');
    if (!list) return;
    const ids = v.related || VIDEOS.map(x => x.id).filter(i => i !== v.id).slice(0, 3);
    list.innerHTML = ids.map(rid => {
      const r = getVideo(rid);
      return `
        <div class="rec-item" data-video-id="${r.id}">
          <div class="rec-thumb"><img src="${r.poster}" alt=""></div>
          <div>
            <div class="rec-title">${r.title}</div>
            <div class="rec-meta">UP主：${r.up} | ${r.date}</div>
          </div>
        </div>`;
    }).join('');
  },

  addHistory(id) {
    this.history = this.history.filter(h => h !== id);
    this.history.unshift(id);
    if (this.history.length > 20) this.history.pop();
    try { localStorage.setItem('bili_history', JSON.stringify(this.history)); } catch (_) {}
  },

  showHistory() {
    try {
      const saved = localStorage.getItem('bili_history');
      if (saved) this.history = JSON.parse(saved);
    } catch (_) {}
    if (!this.history.length) {
      alert('暂无观看历史');
      return;
    }
    const names = this.history.slice(0, 5).map(id => getVideo(id).title).join('\n');
    const pick = confirm('最近观看：\n' + names + '\n\n点击确定播放最近一条');
    if (pick) this.playVideo(this.history[0]);
  },

  go(page, pushHash = true) {
    if (!this.titles[page]) return;
    if (page === 'video') {
      this.loadPlayer(this.currentVideoId);
    }
    this.current = page;
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById('page-' + page)?.classList.add('active');
    if (page !== 'video') document.title = this.titles[page];
    if (pushHash) {
      location.hash = page === 'video' ? `video/${this.currentVideoId}` : page;
    }
    window.scrollTo(0, 0);
    if (page === 'search') this.renderSearch();
    if (page === 'home') this.renderHome();
  },

  bindUpload() {
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    if (!dropZone || !fileInput) return;

    const playLocal = file => {
      const url = URL.createObjectURL(file);
      const localId = 'local_' + Date.now();
      const item = {
        id: localId,
        title: file.name.replace(/\.[^.]+$/, ''),
        category: '生活',
        up: '本地用户',
        views: '0',
        danmaku: '0',
        date: new Date().toISOString().slice(0, 10),
        duration: '--:--',
        src: url,
        poster: '',
        desc: '本地上传的视频',
        related: ['v1', 'v2', 'v3']
      };
      VIDEOS.unshift(item);
      this.renderHome();
      this.playVideo(localId);
      alert('上传成功，正在播放：' + file.name);
    };

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(evt => {
      dropZone.addEventListener(evt, e => { e.preventDefault(); e.stopPropagation(); });
    });
    dropZone.addEventListener('dragover', () => dropZone.style.borderColor = 'var(--bili-blue)');
    dropZone.addEventListener('dragleave', () => dropZone.style.borderColor = '#d0d0d0');
    dropZone.addEventListener('drop', e => {
      dropZone.style.borderColor = '#d0d0d0';
      const f = e.dataTransfer.files[0];
      if (f && f.type.startsWith('video/')) playLocal(f);
      else alert('请拖拽视频文件');
    });
    fileInput.addEventListener('change', () => {
      if (fileInput.files[0]) playLocal(fileInput.files[0]);
    });
    document.querySelector('.btn-select')?.addEventListener('click', () => fileInput.click());
  }
};

document.addEventListener('DOMContentLoaded', () => App.init());
