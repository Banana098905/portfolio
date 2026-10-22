(function() {
  'use strict';

  // ==========================================================================
  // 1. CONSTANTS & CONFIG
  // ==========================================================================

  const STORAGE_KEY = 'studioZero.data.v1';
  const SCHEMA_VERSION = 1;

  const IDEA_STATUS_LABELS = {
    unsorted: '未整理',
    considering: '検討中',
    candidate: '制作候補',
    project: 'プロジェクト化',
    hold: '保留'
  };

  const PROJECT_STATUS_LABELS = {
    planning: '企画中',
    active: '進行中',
    hold: '保留',
    done: '完成'
  };

  const VALID_IDEA_STATUSES = ['unsorted', 'considering', 'candidate', 'project', 'hold'];
  const VALID_PROJECT_STATUSES = ['planning', 'active', 'hold', 'done'];

  // ==========================================================================
  // 2. DATA STORE (StudioZeroStore)
  // ==========================================================================

  class StudioZeroStore {
    constructor() {
      this._data = this._load();
    }

    _defaultData() {
      return {
        schemaVersion: SCHEMA_VERSION,
        ideas: [],
        projects: [],
        lastUpdated: new Date().toISOString()
      };
    }

    _load() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return this._defaultData();
        const data = JSON.parse(raw);
        if (!data || typeof data !== 'object' || !Array.isArray(data.ideas) || !Array.isArray(data.projects)) {
          return this._defaultData();
        }
        return data;
      } catch (e) {
        return this._defaultData();
      }
    }

    _save() {
      this._data.lastUpdated = new Date().toISOString();
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this._data));
      } catch (e) {
        console.error('STUDIO ZERO: Failed to save data', e);
      }
    }

    _generateId() {
      return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
    }

    // IDEAS
    getIdeas() {
      return [...this._data.ideas];
    }

    getIdeaById(id) {
      return this._data.ideas.find(i => i.id === id) || null;
    }

    createIdea({ title, body, tags, status }) {
      // Validate
      title = (title || '').trim();
      if (!title) throw new Error('タイトルは必須です');
      if (title.length > 200) throw new Error('タイトルは200文字以内にしてください');
      body = (body || '').trim();
      if (body.length > 5000) throw new Error('本文は5000文字以内にしてください');

      const idea = {
        id: this._generateId(),
        title,
        body,
        tags: Array.isArray(tags) ? tags.filter(t => t && t.trim()).map(t => t.trim()) : [],
        status: VALID_IDEA_STATUSES.includes(status) ? status : 'unsorted',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      this._data.ideas.unshift(idea);
      this._save();
      return idea;
    }

    updateIdea(id, updates) {
      const idx = this._data.ideas.findIndex(i => i.id === id);
      if (idx === -1) throw new Error('アイデアが見つかりません');
      const idea = this._data.ideas[idx];
      if (updates.title !== undefined) {
        updates.title = (updates.title || '').trim();
        if (!updates.title) throw new Error('タイトルは必須です');
        if (updates.title.length > 200) throw new Error('タイトルは200文字以内にしてください');
        idea.title = updates.title;
      }
      if (updates.body !== undefined) {
        updates.body = (updates.body || '').trim();
        if (updates.body.length > 5000) throw new Error('本文は5000文字以内にしてください');
        idea.body = updates.body;
      }
      if (updates.tags !== undefined) {
        idea.tags = Array.isArray(updates.tags) ? updates.tags.filter(t => t && t.trim()).map(t => t.trim()) : [];
      }
      if (updates.status !== undefined && VALID_IDEA_STATUSES.includes(updates.status)) {
        idea.status = updates.status;
      }
      idea.updatedAt = new Date().toISOString();
      this._save();
      return idea;
    }

    deleteIdea(id) {
      const idx = this._data.ideas.findIndex(i => i.id === id);
      if (idx === -1) return false;
      this._data.ideas.splice(idx, 1);
      // Also remove from any project's relatedIdeaIds
      this._data.projects.forEach(p => {
        p.relatedIdeaIds = (p.relatedIdeaIds || []).filter(iid => iid !== id);
      });
      this._save();
      return true;
    }

    // PROJECTS
    getProjects() {
      return [...this._data.projects];
    }

    getProjectById(id) {
      return this._data.projects.find(p => p.id === id) || null;
    }

    createProject({ name, description, status, nextAction, relatedIdeaIds }) {
      name = (name || '').trim();
      if (!name) throw new Error('プロジェクト名は必須です');
      if (name.length > 200) throw new Error('プロジェクト名は200文字以内にしてください');
      description = (description || '').trim();
      if (description.length > 5000) throw new Error('説明は5000文字以内にしてください');

      const project = {
        id: this._generateId(),
        name,
        description,
        status: VALID_PROJECT_STATUSES.includes(status) ? status : 'planning',
        nextAction: (nextAction || '').trim(),
        relatedIdeaIds: Array.isArray(relatedIdeaIds) ? relatedIdeaIds : [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      this._data.projects.unshift(project);
      this._save();
      return project;
    }

    updateProject(id, updates) {
      const idx = this._data.projects.findIndex(p => p.id === id);
      if (idx === -1) throw new Error('プロジェクトが見つかりません');
      const project = this._data.projects[idx];
      if (updates.name !== undefined) {
        updates.name = (updates.name || '').trim();
        if (!updates.name) throw new Error('プロジェクト名は必須です');
        if (updates.name.length > 200) throw new Error('プロジェクト名は200文字以内にしてください');
        project.name = updates.name;
      }
      if (updates.description !== undefined) {
        updates.description = (updates.description || '').trim();
        if (updates.description.length > 5000) throw new Error('説明は5000文字以内にしてください');
        project.description = updates.description;
      }
      if (updates.status !== undefined && VALID_PROJECT_STATUSES.includes(updates.status)) {
        project.status = updates.status;
      }
      if (updates.nextAction !== undefined) {
        project.nextAction = (updates.nextAction || '').trim();
      }
      if (updates.relatedIdeaIds !== undefined) {
        project.relatedIdeaIds = Array.isArray(updates.relatedIdeaIds) ? updates.relatedIdeaIds : [];
      }
      project.updatedAt = new Date().toISOString();
      this._save();
      return project;
    }

    deleteProject(id) {
      const idx = this._data.projects.findIndex(p => p.id === id);
      if (idx === -1) return false;
      this._data.projects.splice(idx, 1);
      this._save();
      return true;
    }

    // EXPORT / IMPORT
    exportData() {
      return {
        ...this._data,
        exportedAt: new Date().toISOString()
      };
    }

    importData(data) {
      // Validate structure
      if (!data || typeof data !== 'object') throw new Error('無効なデータ形式です');
      if (!Array.isArray(data.ideas)) throw new Error('ideas配列がありません');
      if (!Array.isArray(data.projects)) throw new Error('projects配列がありません');
      // Validate each idea has required fields
      for (const idea of data.ideas) {
        if (!idea.id || !idea.title) throw new Error('不正なアイデアデータがあります');
      }
      for (const project of data.projects) {
        if (!project.id || !project.name) throw new Error('不正なプロジェクトデータがあります');
      }
      // Replace data
      this._data = {
        schemaVersion: data.schemaVersion || SCHEMA_VERSION,
        ideas: data.ideas,
        projects: data.projects,
        lastUpdated: new Date().toISOString()
      };
      this._save();
    }

    // SEARCH
    search(query) {
      if (!query || !query.trim()) return { ideas: [], projects: [] };
      const q = query.trim().toLowerCase();
      const ideas = this._data.ideas.filter(i =>
        i.title.toLowerCase().includes(q) ||
        (i.body || '').toLowerCase().includes(q) ||
        (i.tags || []).some(t => t.toLowerCase().includes(q))
      );
      const projects = this._data.projects.filter(p =>
        p.name.toLowerCase().includes(q) ||
        (p.description || '').toLowerCase().includes(q) ||
        (p.nextAction || '').toLowerCase().includes(q)
      );
      return { ideas, projects };
    }

    // STATS
    getStats() {
      const ideas = this._data.ideas;
      const projects = this._data.projects;
      return {
        totalIdeas: ideas.length,
        totalProjects: projects.length,
        activeProjects: projects.filter(p => p.status === 'active').length,
        recentIdeas: ideas.slice(0, 5),
        recentProjects: projects.slice(0, 5),
        nextActions: projects.filter(p => p.nextAction && p.status !== 'done').slice(0, 5)
      };
    }
  }

  // ==========================================================================
  // 3. UTILITY FUNCTIONS
  // ==========================================================================

  function esc(str) {
    if (str == null) return '';
    return String(str).replace(/[&<>"']/g, function(c) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      }[c];
    });
  }

  function setText(el, text) {
    if (el) el.textContent = text == null ? '' : String(text);
  }

  function formatDate(isoString) {
    if (!isoString) return '';
    try {
      const d = new Date(isoString);
      if (isNaN(d.getTime())) return '';
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${y}.${m}.${day}`;
    } catch (e) {
      return '';
    }
  }

  function formatDateTime(isoString) {
    if (!isoString) return '';
    try {
      const d = new Date(isoString);
      if (isNaN(d.getTime())) return '';
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const h = String(d.getHours()).padStart(2, '0');
      const min = String(d.getMinutes()).padStart(2, '0');
      return `${y}.${m}.${day} ${h}:${min}`;
    } catch (e) {
      return '';
    }
  }

  function formatDeckDate(d = new Date()) {
    const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const ddd = days[d.getDay()];
    return `${y}.${m}.${day} ${ddd}`;
  }

  function $(sel, parent = document) {
    return parent.querySelector(sel);
  }

  function $$(sel, parent = document) {
    return Array.from(parent.querySelectorAll(sel));
  }

  function safeRender(container, html, bindings = {}) {
    container.innerHTML = html;
    if (bindings) {
      for (const [key, val] of Object.entries(bindings)) {
        const targets = container.querySelectorAll(`[data-bind="${key}"]`);
        targets.forEach(el => {
          el.textContent = val == null ? '' : String(val);
        });
      }
    }
    return container;
  }

  // Safe search highlighting without raw innerHTML on user data
  function createHighlightedSnippet(text, query) {
    const fragment = document.createDocumentFragment();
    if (!text) return fragment;
    if (!query || !query.trim()) {
      fragment.appendChild(document.createTextNode(text));
      return fragment;
    }
    const q = query.trim().toLowerCase();
    const lower = text.toLowerCase();
    let pos = 0;
    while (pos < text.length) {
      const idx = lower.indexOf(q, pos);
      if (idx === -1) {
        fragment.appendChild(document.createTextNode(text.substring(pos)));
        break;
      }
      if (idx > pos) {
        fragment.appendChild(document.createTextNode(text.substring(pos, idx)));
      }
      const mark = document.createElement('mark');
      mark.style.backgroundColor = 'rgba(124, 181, 144, 0.3)';
      mark.style.color = '#ffffff';
      mark.style.padding = '0 2px';
      mark.style.borderRadius = '2px';
      mark.textContent = text.substring(idx, idx + q.length);
      fragment.appendChild(mark);
      pos = idx + q.length;
    }
    return fragment;
  }

  // Card element creators
  function createIdeaCardElement(idea) {
    const card = document.createElement('div');
    card.className = 'sz-idea-card sz-card sz-card-interactive';
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', `アイデア: ${idea.title}`);

    const header = document.createElement('div');
    header.className = 'sz-idea-card-header';

    const title = document.createElement('h4');
    title.className = 'sz-idea-card-title';
    title.textContent = idea.title;

    const statusBadge = document.createElement('span');
    statusBadge.className = `sz-status sz-status-${idea.status}`;
    statusBadge.setAttribute('data-status', idea.status);
    statusBadge.textContent = IDEA_STATUS_LABELS[idea.status] || idea.status;

    header.appendChild(title);
    header.appendChild(statusBadge);
    card.appendChild(header);

    if (idea.body) {
      const desc = document.createElement('p');
      desc.className = 'sz-idea-card-desc';
      desc.textContent = idea.body;
      card.appendChild(desc);
    }

    if (idea.tags && idea.tags.length > 0) {
      const tagList = document.createElement('div');
      tagList.className = 'sz-tags';
      idea.tags.forEach(t => {
        const tag = document.createElement('span');
        tag.className = 'sz-tag';
        tag.textContent = t;
        tagList.appendChild(tag);
      });
      card.appendChild(tagList);
    }

    const footer = document.createElement('div');
    footer.className = 'sz-idea-card-footer';

    const dateSpan = document.createElement('span');
    dateSpan.className = 'sz-mono';
    dateSpan.textContent = formatDate(idea.createdAt);
    footer.appendChild(dateSpan);

    card.appendChild(footer);

    function navigate() {
      window.location.hash = `#idea/${idea.id}`;
    }
    card.addEventListener('click', navigate);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        navigate();
      }
    });

    return card;
  }

  function createProjectCardElement(project) {
    const card = document.createElement('div');
    card.className = 'sz-project-card sz-card sz-card-interactive';
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', `プロジェクト: ${project.name}`);

    const header = document.createElement('div');
    header.className = 'sz-project-header';

    const title = document.createElement('h4');
    title.className = 'sz-project-title';
    title.textContent = project.name;

    const statusBadge = document.createElement('span');
    statusBadge.className = `sz-status sz-status-${project.status}`;
    statusBadge.setAttribute('data-status', project.status);
    statusBadge.textContent = PROJECT_STATUS_LABELS[project.status] || project.status;

    header.appendChild(title);
    header.appendChild(statusBadge);
    card.appendChild(header);

    if (project.nextAction) {
      const nextBox = document.createElement('div');
      nextBox.style.padding = '6px 10px';
      nextBox.style.backgroundColor = 'var(--sz-bg-alt)';
      nextBox.style.borderLeft = '2px solid var(--sz-accent)';
      nextBox.style.borderRadius = '3px';
      nextBox.style.fontSize = '12px';
      nextBox.style.display = 'flex';
      nextBox.style.gap = '6px';
      nextBox.style.alignItems = 'baseline';

      const nextLabel = document.createElement('span');
      nextLabel.className = 'sz-mono';
      nextLabel.style.color = 'var(--sz-accent)';
      nextLabel.style.fontWeight = '600';
      nextLabel.style.fontSize = '10px';
      nextLabel.textContent = 'NEXT:';

      const nextVal = document.createElement('span');
      nextVal.className = 'sz-truncate';
      nextVal.textContent = project.nextAction;

      nextBox.appendChild(nextLabel);
      nextBox.appendChild(nextVal);
      card.appendChild(nextBox);
    }

    if (project.description) {
      const desc = document.createElement('p');
      desc.className = 'sz-project-desc sz-truncate';
      desc.textContent = project.description;
      card.appendChild(desc);
    }

    const footer = document.createElement('div');
    footer.className = 'sz-idea-card-footer';

    const countSpan = document.createElement('span');
    countSpan.className = 'sz-mono';
    const relCount = Array.isArray(project.relatedIdeaIds) ? project.relatedIdeaIds.length : 0;
    countSpan.textContent = `関連アイデア: ${relCount} 件`;
    footer.appendChild(countSpan);

    const dateSpan = document.createElement('span');
    dateSpan.className = 'sz-mono';
    dateSpan.textContent = formatDate(project.updatedAt || project.createdAt);
    footer.appendChild(dateSpan);

    card.appendChild(footer);

    function navigate() {
      window.location.hash = `#project/${project.id}`;
    }
    card.addEventListener('click', navigate);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        navigate();
      }
    });

    return card;
  }

  // ==========================================================================
  // 4. MODAL & CONFIRM SYSTEM
  // ==========================================================================

  let modalPreviousFocus = null;

  function showModal({ title, bodyHtml, onSubmit, onRender }) {
    const modal = $('#szModal');
    if (!modal) return;

    modalPreviousFocus = document.activeElement;

    modal.innerHTML = `
      <div class="sz-modal-content">
        <div class="sz-modal-header">
          <h3 class="sz-modal-title" id="szModalTitle"></h3>
          <button type="button" class="sz-modal-close" id="szModalClose" aria-label="閉じる">✕</button>
        </div>
        <form id="szModalForm" class="sz-modal-form">
          <div class="sz-modal-body" id="szModalBody"></div>
          <div class="sz-modal-footer">
            <button type="button" class="sz-btn sz-btn-ghost" id="szModalCancel">キャンセル</button>
            <button type="submit" class="sz-btn sz-btn-primary" id="szModalSubmit">保存</button>
          </div>
        </form>
      </div>
    `;

    setText($('#szModalTitle', modal), title);
    const bodyEl = $('#szModalBody', modal);
    if (typeof bodyHtml === 'string') {
      bodyEl.innerHTML = bodyHtml;
    } else if (bodyHtml instanceof Node) {
      bodyEl.appendChild(bodyHtml);
    }

    if (typeof onRender === 'function') {
      onRender(modal);
    }

    const form = $('#szModalForm', modal);
    const closeBtn = $('#szModalClose', modal);
    const cancelBtn = $('#szModalCancel', modal);

    function closeModal() {
      if (modal.open) {
        modal.close();
      }
    }

    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);

    modal.onclick = function(e) {
      if (e.target === modal) {
        closeModal();
      }
    };

    modal.onclose = function() {
      if (modalPreviousFocus && typeof modalPreviousFocus.focus === 'function') {
        try { modalPreviousFocus.focus(); } catch (err) {}
      }
    };

    form.onsubmit = function(e) {
      e.preventDefault();
      if (onSubmit) {
        try {
          const result = onSubmit(new FormData(form), form);
          if (result !== false) {
            closeModal();
          }
        } catch (err) {
          alert(err.message || 'エラーが発生しました');
        }
      } else {
        closeModal();
      }
    };

    modal.showModal();

    const firstInput = modal.querySelector('input:not([type="hidden"]), textarea, select, button[type="submit"]');
    if (firstInput) {
      firstInput.focus();
    }
  }

  let confirmPreviousFocus = null;

  function showConfirm({ message, confirmText = '実行', cancelText = 'キャンセル', isDanger = false, onConfirm }) {
    const confirmModal = $('#szConfirm');
    if (!confirmModal) return;

    confirmPreviousFocus = document.activeElement;

    confirmModal.innerHTML = `
      <div class="sz-modal-content" style="padding: 24px;">
        <div style="margin-bottom: 20px;">
          <p id="szConfirmMessage" style="font-size: 14px; line-height: 1.6; margin: 0; white-space: pre-wrap; color: var(--sz-text);"></p>
        </div>
        <div style="display: flex; justify-content: flex-end; gap: 12px;">
          <button type="button" class="sz-btn sz-btn-ghost" id="szConfirmCancel"></button>
          <button type="button" class="sz-btn ${isDanger ? 'sz-btn-danger' : 'sz-btn-primary'}" id="szConfirmOk"></button>
        </div>
      </div>
    `;

    setText($('#szConfirmMessage', confirmModal), message);
    setText($('#szConfirmCancel', confirmModal), cancelText);
    setText($('#szConfirmOk', confirmModal), confirmText);

    function closeConfirm() {
      if (confirmModal.open) {
        confirmModal.close();
      }
    }

    $('#szConfirmCancel', confirmModal).addEventListener('click', closeConfirm);
    $('#szConfirmOk', confirmModal).addEventListener('click', () => {
      closeConfirm();
      if (onConfirm) onConfirm();
    });

    confirmModal.onclick = function(e) {
      if (e.target === confirmModal) {
        closeConfirm();
      }
    };

    confirmModal.onclose = function() {
      if (confirmPreviousFocus && typeof confirmPreviousFocus.focus === 'function') {
        try { confirmPreviousFocus.focus(); } catch (err) {}
      }
    };

    confirmModal.showModal();
    const okBtn = $('#szConfirmOk', confirmModal);
    if (okBtn) okBtn.focus();
  }

  // ==========================================================================
  // 5. VIEW RENDER FUNCTIONS
  // ==========================================================================

  let store = null;
  let hasUnsavedQuickCapture = false;

  // Track quick capture edits to warn before unload
  window.addEventListener('beforeunload', function(e) {
    if (hasUnsavedQuickCapture) {
      e.preventDefault();
      e.returnValue = '';
    }
  });

  // --------------------------------------------------------------------------
  // 5.1 MAIN DECK VIEW (#deck)
  // --------------------------------------------------------------------------
  function renderDeck() {
    const main = $('#szMain');
    if (!main) return;

    const stats = store.getStats();

    const container = document.createElement('div');
    container.className = 'sz-fade-in';

    // Header
    const headerHtml = `
      <div class="sz-deck-header">
        <div class="sz-deck-greeting">
          <span class="sz-mono sz-text-dim" data-bind="dateStr"></span>
          <h2 class="sz-deck-title">STUDIO ZERO</h2>
          <p class="sz-text-dim" style="margin: 0;">制作の続きを始めよう。</p>
        </div>
      </div>
    `;
    const headerEl = document.createElement('div');
    safeRender(headerEl, headerHtml, { dateStr: formatDeckDate() });
    container.appendChild(headerEl.firstElementChild);

    // Stats
    const statsHtml = `
      <div class="sz-deck-stats">
        <div class="sz-stat">
          <span class="sz-stat-value sz-stat-num" data-bind="ideas">0</span>
          <span class="sz-stat-label">IDEAS</span>
        </div>
        <div class="sz-stat">
          <span class="sz-stat-value sz-stat-num" data-bind="projects">0</span>
          <span class="sz-stat-label">PROJECTS</span>
        </div>
        <div class="sz-stat">
          <span class="sz-stat-value sz-stat-num" data-bind="active">0</span>
          <span class="sz-stat-label">ACTIVE</span>
        </div>
      </div>
    `;
    const statsEl = document.createElement('div');
    safeRender(statsEl, statsHtml, {
      ideas: stats.totalIdeas,
      projects: stats.totalProjects,
      active: stats.activeProjects
    });
    container.appendChild(statsEl.firstElementChild);

    // Quick Capture
    const qcSection = document.createElement('div');
    qcSection.className = 'sz-deck-section';
    qcSection.innerHTML = `
      <h3 class="sz-deck-section-title"><span class="sz-mono">QUICK CAPTURE</span></h3>
      <div class="sz-quick-capture">
        <form id="quickCaptureForm">
          <div class="sz-form-group">
            <input class="sz-input" id="qcTitle" placeholder="アイデアのタイトル" maxlength="200" required autocomplete="off">
          </div>
          <div class="sz-form-group">
            <textarea class="sz-textarea" id="qcBody" placeholder="メモ（任意）" rows="2" maxlength="5000"></textarea>
          </div>
          <div class="sz-form-group">
            <input class="sz-input" id="qcTags" placeholder="タグ（カンマ区切り、例: UI, ゲーム, 演出）" autocomplete="off">
          </div>
          <div style="display: flex; justify-content: flex-end; align-items: center; gap: 12px; margin-top: 8px;">
            <div id="qcFeedback" class="sz-hidden" style="font-family: var(--sz-mono); font-size: 12px; color: var(--sz-accent-bright);"></div>
            <button type="submit" class="sz-btn sz-btn-primary">保存</button>
          </div>
        </form>
      </div>
    `;
    container.appendChild(qcSection);

    // Form handlers
    const qcForm = qcSection.querySelector('#quickCaptureForm');
    const qcTitle = qcSection.querySelector('#qcTitle');
    const qcBody = qcSection.querySelector('#qcBody');
    const qcTags = qcSection.querySelector('#qcTags');
    const qcFeedback = qcSection.querySelector('#qcFeedback');

    function checkUnsaved() {
      hasUnsavedQuickCapture = Boolean(qcTitle.value.trim() || qcBody.value.trim());
    }
    qcTitle.addEventListener('input', checkUnsaved);
    qcBody.addEventListener('input', checkUnsaved);

    qcForm.addEventListener('submit', function(e) {
      e.preventDefault();
      try {
        const title = qcTitle.value.trim();
        const body = qcBody.value.trim();
        const tags = qcTags.value.split(/[,、]/).map(t => t.trim()).filter(Boolean);

        store.createIdea({
          title,
          body,
          tags,
          status: 'unsorted'
        });

        hasUnsavedQuickCapture = false;
        qcForm.reset();

        // Feedback message
        setText(qcFeedback, `✓ アイデア「${title}」を保存しました`);
        qcFeedback.classList.remove('sz-hidden');
        qcFeedback.classList.add('sz-fade-in');
        setTimeout(() => {
          qcFeedback.classList.add('sz-hidden');
        }, 3000);

        // Re-render deck to update stats and recent ideas
        renderDeck();
      } catch (err) {
        alert(err.message || '保存に失敗しました');
      }
    });

    // Next Actions (if any)
    if (stats.nextActions.length > 0) {
      const naSection = document.createElement('div');
      naSection.className = 'sz-deck-section';
      naSection.innerHTML = `<h3 class="sz-deck-section-title"><span class="sz-mono">NEXT ACTIONS</span></h3>`;

      const naList = document.createElement('div');
      naList.style.display = 'flex';
      naList.style.flexDirection = 'column';
      naList.style.gap = '10px';

      stats.nextActions.forEach(project => {
        const item = document.createElement('div');
        item.className = 'sz-card sz-card-interactive';
        item.style.padding = '14px 18px';
        item.style.display = 'flex';
        item.style.justifyContent = 'space-between';
        item.style.alignItems = 'center';
        item.style.gap = '16px';
        item.setAttribute('role', 'button');
        item.setAttribute('tabindex', '0');

        const left = document.createElement('div');
        left.style.display = 'flex';
        left.style.flexDirection = 'column';
        left.style.gap = '4px';

        const projName = document.createElement('div');
        projName.style.fontSize = '14px';
        projName.style.fontWeight = '600';
        projName.style.color = '#ffffff';
        projName.textContent = project.name;

        const naText = document.createElement('div');
        naText.style.fontSize = '12px';
        naText.style.color = 'var(--sz-accent-bright)';
        naText.style.display = 'flex';
        naText.style.gap = '6px';
        naText.style.alignItems = 'baseline';

        const naTag = document.createElement('span');
        naTag.className = 'sz-mono';
        naTag.style.fontSize = '10px';
        naTag.style.color = 'var(--sz-text-dim)';
        naTag.textContent = 'ACTION:';

        const naContent = document.createElement('span');
        naContent.textContent = project.nextAction;

        naText.appendChild(naTag);
        naText.appendChild(naContent);

        left.appendChild(projName);
        left.appendChild(naText);

        const right = document.createElement('div');
        const statusBadge = document.createElement('span');
        statusBadge.className = `sz-status sz-status-${project.status}`;
        statusBadge.setAttribute('data-status', project.status);
        statusBadge.textContent = PROJECT_STATUS_LABELS[project.status] || project.status;
        right.appendChild(statusBadge);

        item.appendChild(left);
        item.appendChild(right);

        function goProject() {
          window.location.hash = `#project/${project.id}`;
        }
        item.addEventListener('click', goProject);
        item.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            goProject();
          }
        });

        naList.appendChild(item);
      });

      naSection.appendChild(naList);
      container.appendChild(naSection);
    }

    // Recent Ideas
    const ideasSection = document.createElement('div');
    ideasSection.className = 'sz-deck-section';
    ideasSection.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 14px;">
        <h3 class="sz-deck-section-title" style="margin-bottom: 0;"><span class="sz-mono">RECENT IDEAS</span></h3>
        <a href="#ideas" class="sz-mono" style="font-size: 11px; color: var(--sz-accent); text-decoration: none;">すべて見る →</a>
      </div>
    `;

    if (stats.recentIdeas.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'sz-empty';
      empty.textContent = 'アイデアはまだありません。「QUICK CAPTURE」から追加してください。';
      ideasSection.appendChild(empty);
    } else {
      const grid = document.createElement('div');
      grid.className = 'sz-idea-grid';
      stats.recentIdeas.forEach(idea => {
        grid.appendChild(createIdeaCardElement(idea));
      });
      ideasSection.appendChild(grid);
    }
    container.appendChild(ideasSection);

    // Recent Projects
    const projectsSection = document.createElement('div');
    projectsSection.className = 'sz-deck-section';
    projectsSection.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 14px;">
        <h3 class="sz-deck-section-title" style="margin-bottom: 0;"><span class="sz-mono">RECENT PROJECTS</span></h3>
        <a href="#projects" class="sz-mono" style="font-size: 11px; color: var(--sz-accent); text-decoration: none;">すべて見る →</a>
      </div>
    `;

    if (stats.recentProjects.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'sz-empty';
      empty.textContent = 'プロジェクトはまだありません。PROJECTS タブから作成できます。';
      projectsSection.appendChild(empty);
    } else {
      const grid = document.createElement('div');
      grid.className = 'sz-projects-grid';
      stats.recentProjects.forEach(project => {
        grid.appendChild(createProjectCardElement(project));
      });
      projectsSection.appendChild(grid);
    }
    container.appendChild(projectsSection);

    main.innerHTML = '';
    main.appendChild(container);
  }

  // --------------------------------------------------------------------------
  // 5.2 IDEA VAULT VIEW (#ideas)
  // --------------------------------------------------------------------------
  function renderIdeas() {
    const main = $('#szMain');
    if (!main) return;

    const allIdeas = store.getIdeas();

    // Extract all unique tags
    const allTags = Array.from(new Set(allIdeas.flatMap(i => i.tags || []))).sort();

    const container = document.createElement('div');
    container.className = 'sz-fade-in';

    // Header
    const header = document.createElement('div');
    header.className = 'sz-deck-header';
    header.innerHTML = `
      <div>
        <h2 class="sz-deck-title">IDEA VAULT</h2>
        <div class="sz-deck-meta">全 <span id="ideasTotalCount">${allIdeas.length}</span> 件のアイデア</div>
      </div>
      <div>
        <button type="button" class="sz-btn sz-btn-primary" id="btnNewIdea">+ 新しいアイデア</button>
      </div>
    `;
    container.appendChild(header);

    // Filter bar
    const filterBar = document.createElement('div');
    filterBar.className = 'sz-filter-bar';
    filterBar.innerHTML = `
      <div class="sz-filter-group" style="flex: 2; min-width: 220px;">
        <input type="search" class="sz-input" id="ideaSearchInput" placeholder="キーワードで絞り込み..." autocomplete="off">
      </div>
      <div class="sz-filter-group" style="flex: 1; min-width: 140px;">
        <select class="sz-select" id="ideaStatusSelect">
          <option value="all">すべてのステータス</option>
          <option value="unsorted">未整理</option>
          <option value="considering">検討中</option>
          <option value="candidate">制作候補</option>
          <option value="project">プロジェクト化</option>
          <option value="hold">保留</option>
        </select>
      </div>
      <div class="sz-filter-group" style="flex: 1; min-width: 140px;">
        <select class="sz-select" id="ideaTagSelect">
          <option value="all">すべてのタグ</option>
        </select>
      </div>
    `;
    const tagSelect = filterBar.querySelector('#ideaTagSelect');
    allTags.forEach(t => {
      const opt = document.createElement('option');
      opt.value = t;
      opt.textContent = `#${t}`;
      tagSelect.appendChild(opt);
    });
    container.appendChild(filterBar);

    // Grid container
    const gridContainer = document.createElement('div');
    container.appendChild(gridContainer);

    function updateGrid() {
      const q = (filterBar.querySelector('#ideaSearchInput').value || '').trim().toLowerCase();
      const statusFilter = filterBar.querySelector('#ideaStatusSelect').value;
      const tagFilter = filterBar.querySelector('#ideaTagSelect').value;

      const filtered = allIdeas.filter(idea => {
        if (statusFilter !== 'all' && idea.status !== statusFilter) return false;
        if (tagFilter !== 'all' && !(idea.tags || []).includes(tagFilter)) return false;
        if (q) {
          const matchTitle = idea.title.toLowerCase().includes(q);
          const matchBody = (idea.body || '').toLowerCase().includes(q);
          const matchTag = (idea.tags || []).some(t => t.toLowerCase().includes(q));
          if (!matchTitle && !matchBody && !matchTag) return false;
        }
        return true;
      });

      gridContainer.innerHTML = '';

      if (filtered.length === 0) {
        const empty = document.createElement('div');
        empty.className = 'sz-empty';
        if (allIdeas.length === 0) {
          empty.innerHTML = `
            <span>アイデアはまだ登録されていません。</span>
            <button type="button" class="sz-btn sz-btn-primary" id="btnEmptyNewIdea" style="margin-top: 8px;">+ アイデアを作成</button>
          `;
          empty.querySelector('#btnEmptyNewIdea').addEventListener('click', openCreateIdeaModal);
        } else {
          empty.textContent = '条件に一致するアイデアが見つかりませんでした。';
        }
        gridContainer.appendChild(empty);
      } else {
        const grid = document.createElement('div');
        grid.className = 'sz-idea-grid';
        filtered.forEach(idea => {
          grid.appendChild(createIdeaCardElement(idea));
        });
        gridContainer.appendChild(grid);
      }
    }

    filterBar.querySelector('#ideaSearchInput').addEventListener('input', updateGrid);
    filterBar.querySelector('#ideaStatusSelect').addEventListener('change', updateGrid);
    filterBar.querySelector('#ideaTagSelect').addEventListener('change', updateGrid);

    function openCreateIdeaModal() {
      const formHtml = `
        <div class="sz-form-group">
          <label class="sz-label" for="modalIdeaTitle">タイトル <span style="color:var(--sz-danger)">*</span></label>
          <input class="sz-input" id="modalIdeaTitle" name="title" maxlength="200" required placeholder="アイデアの要約や仮称">
        </div>
        <div class="sz-form-group">
          <label class="sz-label" for="modalIdeaStatus">ステータス</label>
          <select class="sz-select" id="modalIdeaStatus" name="status">
            <option value="unsorted">未整理</option>
            <option value="considering">検討中</option>
            <option value="candidate">制作候補</option>
            <option value="project">プロジェクト化</option>
            <option value="hold">保留</option>
          </select>
        </div>
        <div class="sz-form-group">
          <label class="sz-label" for="modalIdeaTags">タグ</label>
          <input class="sz-input" id="modalIdeaTags" name="tags" placeholder="カンマ区切り (例: UI, ゲーム, 演出)">
        </div>
        <div class="sz-form-group">
          <label class="sz-label" for="modalIdeaBody">本文 / メモ</label>
          <textarea class="sz-textarea" id="modalIdeaBody" name="body" rows="6" maxlength="5000" placeholder="アイデアの背景、仕様メモ、着想など..."></textarea>
        </div>
      `;

      showModal({
        title: '新しいアイデアを作成',
        bodyHtml: formHtml,
        onSubmit: (formData) => {
          const title = formData.get('title');
          const status = formData.get('status');
          const body = formData.get('body');
          const rawTags = formData.get('tags') || '';
          const tags = rawTags.split(/[,、]/).map(t => t.trim()).filter(Boolean);

          store.createIdea({
            title,
            status,
            body,
            tags
          });

          renderIdeas();
        }
      });
    }

    header.querySelector('#btnNewIdea').addEventListener('click', openCreateIdeaModal);

    updateGrid();

    main.innerHTML = '';
    main.appendChild(container);
  }

  // --------------------------------------------------------------------------
  // 5.3 IDEA DETAIL VIEW (#idea/{id})
  // --------------------------------------------------------------------------
  function renderIdeaDetail(id) {
    const main = $('#szMain');
    if (!main) return;

    const idea = store.getIdeaById(id);
    const container = document.createElement('div');
    container.className = 'sz-fade-in';

    if (!idea) {
      container.innerHTML = `
        <div class="sz-empty">
          <span>アイデアが見つかりませんでした。</span>
          <a href="#ideas" class="sz-btn sz-btn-ghost" style="margin-top: 12px;">← アイデア一覧に戻る</a>
        </div>
      `;
      main.innerHTML = '';
      main.appendChild(container);
      return;
    }

    // Related projects referencing this idea
    const relatedProjects = store.getProjects().filter(p => (p.relatedIdeaIds || []).includes(idea.id));

    // Top action bar
    const topBar = document.createElement('div');
    topBar.style.display = 'flex';
    topBar.style.justifyContent = 'space-between';
    topBar.style.alignItems = 'center';
    topBar.style.marginBottom = '24px';
    topBar.innerHTML = `
      <a href="#ideas" class="sz-btn sz-btn-ghost sz-btn-sm">← アイデア一覧に戻る</a>
      <div style="display: flex; gap: 8px;">
        <button type="button" class="sz-btn sz-btn-ghost sz-btn-sm" id="btnConvertToProject">プロジェクト化</button>
        <button type="button" class="sz-btn sz-btn-sm" id="btnEditIdea">編集</button>
        <button type="button" class="sz-btn sz-btn-danger sz-btn-sm" id="btnDeleteIdea">削除</button>
      </div>
    `;
    container.appendChild(topBar);

    // Main Card
    const card = document.createElement('div');
    card.className = 'sz-card';
    card.style.marginBottom = '28px';

    const header = document.createElement('div');
    header.style.display = 'flex';
    header.style.justifyContent = 'space-between';
    header.style.alignItems = 'flex-start';
    header.style.gap = '16px';
    header.style.marginBottom = '16px';

    const titleWrap = document.createElement('div');
    const title = document.createElement('h2');
    title.className = 'sz-deck-title';
    title.style.fontSize = '20px';
    title.textContent = idea.title;
    titleWrap.appendChild(title);

    const meta = document.createElement('div');
    meta.className = 'sz-mono sz-text-dim';
    meta.style.fontSize = '11px';
    meta.textContent = `作成: ${formatDateTime(idea.createdAt)} · 更新: ${formatDateTime(idea.updatedAt)}`;
    titleWrap.appendChild(meta);

    const statusBadge = document.createElement('span');
    statusBadge.className = `sz-status sz-status-${idea.status}`;
    statusBadge.setAttribute('data-status', idea.status);
    statusBadge.textContent = IDEA_STATUS_LABELS[idea.status] || idea.status;

    header.appendChild(titleWrap);
    header.appendChild(statusBadge);
    card.appendChild(header);

    // Tags
    if (idea.tags && idea.tags.length > 0) {
      const tagList = document.createElement('div');
      tagList.className = 'sz-tags';
      tagList.style.marginBottom = '20px';
      idea.tags.forEach(t => {
        const tag = document.createElement('span');
        tag.className = 'sz-tag';
        tag.textContent = t;
        tagList.appendChild(tag);
      });
      card.appendChild(tagList);
    }

    // Body
    const bodyBox = document.createElement('div');
    bodyBox.style.padding = '18px 20px';
    bodyBox.style.backgroundColor = 'var(--sz-bg-alt)';
    bodyBox.style.borderRadius = 'var(--sz-radius)';
    bodyBox.style.border = '1px solid var(--sz-border)';
    bodyBox.style.fontSize = '14px';
    bodyBox.style.lineHeight = '1.7';
    bodyBox.style.whiteSpace = 'pre-wrap';
    bodyBox.style.wordBreak = 'break-word';

    if (idea.body) {
      bodyBox.textContent = idea.body;
    } else {
      const placeholder = document.createElement('span');
      placeholder.className = 'sz-text-muted';
      placeholder.textContent = '（本文メモはありません）';
      bodyBox.appendChild(placeholder);
    }
    card.appendChild(bodyBox);
    container.appendChild(card);

    // Related Projects section
    const relSection = document.createElement('div');
    relSection.className = 'sz-deck-section';
    relSection.innerHTML = `
      <h3 class="sz-deck-section-title"><span class="sz-mono">RELATED PROJECTS (${relatedProjects.length})</span></h3>
    `;

    if (relatedProjects.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'sz-empty';
      empty.textContent = 'このアイデアを参照しているプロジェクトはありません。';
      relSection.appendChild(empty);
    } else {
      const grid = document.createElement('div');
      grid.className = 'sz-projects-grid';
      relatedProjects.forEach(p => {
        grid.appendChild(createProjectCardElement(p));
      });
      relSection.appendChild(grid);
    }
    container.appendChild(relSection);

    // Handlers
    topBar.querySelector('#btnEditIdea').addEventListener('click', () => {
      const formHtml = `
        <div class="sz-form-group">
          <label class="sz-label" for="editIdeaTitle">タイトル <span style="color:var(--sz-danger)">*</span></label>
          <input class="sz-input" id="editIdeaTitle" name="title" maxlength="200" required value="${esc(idea.title)}">
        </div>
        <div class="sz-form-group">
          <label class="sz-label" for="editIdeaStatus">ステータス</label>
          <select class="sz-select" id="editIdeaStatus" name="status">
            ${VALID_IDEA_STATUSES.map(st => `
              <option value="${st}" ${idea.status === st ? 'selected' : ''}>${IDEA_STATUS_LABELS[st]}</option>
            `).join('')}
          </select>
        </div>
        <div class="sz-form-group">
          <label class="sz-label" for="editIdeaTags">タグ</label>
          <input class="sz-input" id="editIdeaTags" name="tags" value="${esc((idea.tags || []).join(', '))}" placeholder="カンマ区切り (例: UI, ゲーム)">
        </div>
        <div class="sz-form-group">
          <label class="sz-label" for="editIdeaBody">本文 / メモ</label>
          <textarea class="sz-textarea" id="editIdeaBody" name="body" rows="8" maxlength="5000">${esc(idea.body || '')}</textarea>
        </div>
      `;

      showModal({
        title: 'アイデアを編集',
        bodyHtml: formHtml,
        onSubmit: (formData) => {
          const title = formData.get('title');
          const status = formData.get('status');
          const body = formData.get('body');
          const rawTags = formData.get('tags') || '';
          const tags = rawTags.split(/[,、]/).map(t => t.trim()).filter(Boolean);

          store.updateIdea(idea.id, {
            title,
            status,
            body,
            tags
          });

          renderIdeaDetail(idea.id);
        }
      });
    });

    topBar.querySelector('#btnDeleteIdea').addEventListener('click', () => {
      showConfirm({
        message: `アイデア「${idea.title}」を削除しますか？\n\n関連付けられたプロジェクトからも参照が解除されます。この操作は取り消せません。`,
        confirmText: '削除',
        isDanger: true,
        onConfirm: () => {
          store.deleteIdea(idea.id);
          window.location.hash = '#ideas';
        }
      });
    });

    topBar.querySelector('#btnConvertToProject').addEventListener('click', () => {
      // Pre-fill project creation modal with this idea linked
      const formHtml = `
        <div class="sz-form-group">
          <label class="sz-label" for="convProjName">プロジェクト名 <span style="color:var(--sz-danger)">*</span></label>
          <input class="sz-input" id="convProjName" name="name" maxlength="200" required value="${esc(idea.title)}">
        </div>
        <div class="sz-form-group">
          <label class="sz-label" for="convProjStatus">ステータス</label>
          <select class="sz-select" id="convProjStatus" name="status">
            <option value="planning" selected>企画中</option>
            <option value="active">進行中</option>
            <option value="hold">保留</option>
            <option value="done">完成</option>
          </select>
        </div>
        <div class="sz-form-group">
          <label class="sz-label" for="convProjNext">次にやること</label>
          <input class="sz-input" id="convProjNext" name="nextAction" maxlength="200" placeholder="例: 仕様書の草案作成">
        </div>
        <div class="sz-form-group">
          <label class="sz-label" for="convProjDesc">説明</label>
          <textarea class="sz-textarea" id="convProjDesc" name="description" rows="5" maxlength="5000" placeholder="プロジェクトの目的や概要">${esc(idea.body || '')}</textarea>
        </div>
      `;

      showModal({
        title: 'アイデアからプロジェクトを作成',
        bodyHtml: formHtml,
        onSubmit: (formData) => {
          const name = formData.get('name');
          const status = formData.get('status');
          const nextAction = formData.get('nextAction');
          const description = formData.get('description');

          const newProj = store.createProject({
            name,
            status,
            nextAction,
            description,
            relatedIdeaIds: [idea.id]
          });

          // Also set idea status to 'project'
          store.updateIdea(idea.id, { status: 'project' });

          window.location.hash = `#project/${newProj.id}`;
        }
      });
    });

    main.innerHTML = '';
    main.appendChild(container);
  }

  // --------------------------------------------------------------------------
  // 5.4 PROJECTS VIEW (#projects)
  // --------------------------------------------------------------------------
  function renderProjects() {
    const main = $('#szMain');
    if (!main) return;

    const allProjects = store.getProjects();
    const allIdeas = store.getIdeas();

    const container = document.createElement('div');
    container.className = 'sz-fade-in';

    // Header
    const header = document.createElement('div');
    header.className = 'sz-deck-header';
    header.innerHTML = `
      <div>
        <h2 class="sz-deck-title">PROJECTS</h2>
        <div class="sz-deck-meta">全 <span id="projectsTotalCount">${allProjects.length}</span> 件のプロジェクト</div>
      </div>
      <div>
        <button type="button" class="sz-btn sz-btn-primary" id="btnNewProject">+ 新しいプロジェクト</button>
      </div>
    `;
    container.appendChild(header);

    // Filter bar
    const filterBar = document.createElement('div');
    filterBar.className = 'sz-filter-bar';
    filterBar.innerHTML = `
      <div class="sz-filter-group" style="flex: 2; min-width: 220px;">
        <input type="search" class="sz-input" id="projSearchInput" placeholder="プロジェクト名・説明・アクションで検索..." autocomplete="off">
      </div>
      <div class="sz-filter-group" style="flex: 1; min-width: 160px;">
        <select class="sz-select" id="projStatusSelect">
          <option value="all">すべてのステータス</option>
          <option value="planning">企画中</option>
          <option value="active">進行中</option>
          <option value="hold">保留</option>
          <option value="done">完成</option>
        </select>
      </div>
    `;
    container.appendChild(filterBar);

    // Grid container
    const gridContainer = document.createElement('div');
    container.appendChild(gridContainer);

    function updateGrid() {
      const q = (filterBar.querySelector('#projSearchInput').value || '').trim().toLowerCase();
      const statusFilter = filterBar.querySelector('#projStatusSelect').value;

      const filtered = allProjects.filter(project => {
        if (statusFilter !== 'all' && project.status !== statusFilter) return false;
        if (q) {
          const matchName = project.name.toLowerCase().includes(q);
          const matchDesc = (project.description || '').toLowerCase().includes(q);
          const matchAction = (project.nextAction || '').toLowerCase().includes(q);
          if (!matchName && !matchDesc && !matchAction) return false;
        }
        return true;
      });

      gridContainer.innerHTML = '';

      if (filtered.length === 0) {
        const empty = document.createElement('div');
        empty.className = 'sz-empty';
        if (allProjects.length === 0) {
          empty.innerHTML = `
            <span>プロジェクトはまだ登録されていません。</span>
            <button type="button" class="sz-btn sz-btn-primary" id="btnEmptyNewProject" style="margin-top: 8px;">+ プロジェクトを作成</button>
          `;
          empty.querySelector('#btnEmptyNewProject').addEventListener('click', openCreateProjectModal);
        } else {
          empty.textContent = '条件に一致するプロジェクトが見つかりませんでした。';
        }
        gridContainer.appendChild(empty);
      } else {
        const grid = document.createElement('div');
        grid.className = 'sz-projects-grid';
        filtered.forEach(p => {
          grid.appendChild(createProjectCardElement(p));
        });
        gridContainer.appendChild(grid);
      }
    }

    filterBar.querySelector('#projSearchInput').addEventListener('input', updateGrid);
    filterBar.querySelector('#projStatusSelect').addEventListener('change', updateGrid);

    function openCreateProjectModal() {
      const formHtml = `
        <div class="sz-form-group">
          <label class="sz-label" for="modalProjName">プロジェクト名 <span style="color:var(--sz-danger)">*</span></label>
          <input class="sz-input" id="modalProjName" name="name" maxlength="200" required placeholder="プロジェクトの名称">
        </div>
        <div class="sz-form-group">
          <label class="sz-label" for="modalProjStatus">ステータス</label>
          <select class="sz-select" id="modalProjStatus" name="status">
            <option value="planning">企画中</option>
            <option value="active">進行中</option>
            <option value="hold">保留</option>
            <option value="done">完成</option>
          </select>
        </div>
        <div class="sz-form-group">
          <label class="sz-label" for="modalProjNext">次にやること</label>
          <input class="sz-input" id="modalProjNext" name="nextAction" maxlength="200" placeholder="例: 画面遷移図の作成">
        </div>
        <div class="sz-form-group">
          <label class="sz-label" for="modalProjDesc">説明</label>
          <textarea class="sz-textarea" id="modalProjDesc" name="description" rows="4" maxlength="5000" placeholder="概要や開発方針など..."></textarea>
        </div>
        <div class="sz-form-group">
          <label class="sz-label">関連アイデア</label>
          <div id="modalProjIdeasWrap" style="max-height: 180px; overflow-y: auto; background-color: var(--sz-bg-alt); border: 1px solid var(--sz-border); border-radius: var(--sz-radius); padding: 10px 14px; display: flex; flex-direction: column; gap: 8px;">
            ${allIdeas.length === 0 ? `
              <span class="sz-text-muted" style="font-size: 12px;">（登録されたアイデアはありません）</span>
            ` : allIdeas.map(idea => `
              <label style="display: flex; align-items: center; gap: 8px; font-size: 13px; cursor: pointer;">
                <input type="checkbox" name="relatedIdea" value="${esc(idea.id)}">
                <span class="sz-truncate">${esc(idea.title)}</span>
                <span class="sz-status sz-status-${idea.status}" style="font-size: 10px; margin-left: auto;">${IDEA_STATUS_LABELS[idea.status]}</span>
              </label>
            `).join('')}
          </div>
        </div>
      `;

      showModal({
        title: '新しいプロジェクトを作成',
        bodyHtml: formHtml,
        onSubmit: (formData, form) => {
          const name = formData.get('name');
          const status = formData.get('status');
          const nextAction = formData.get('nextAction');
          const description = formData.get('description');

          const checkedCheckboxes = form.querySelectorAll('input[name="relatedIdea"]:checked');
          const relatedIdeaIds = Array.from(checkedCheckboxes).map(cb => cb.value);

          store.createProject({
            name,
            status,
            nextAction,
            description,
            relatedIdeaIds
          });

          renderProjects();
        }
      });
    }

    header.querySelector('#btnNewProject').addEventListener('click', openCreateProjectModal);

    updateGrid();

    main.innerHTML = '';
    main.appendChild(container);
  }

  // --------------------------------------------------------------------------
  // 5.5 PROJECT DETAIL VIEW (#project/{id})
  // --------------------------------------------------------------------------
  function renderProjectDetail(id) {
    const main = $('#szMain');
    if (!main) return;

    const project = store.getProjectById(id);
    const container = document.createElement('div');
    container.className = 'sz-fade-in';

    if (!project) {
      container.innerHTML = `
        <div class="sz-empty">
          <span>プロジェクトが見つかりませんでした。</span>
          <a href="#projects" class="sz-btn sz-btn-ghost" style="margin-top: 12px;">← プロジェクト一覧に戻る</a>
        </div>
      `;
      main.innerHTML = '';
      main.appendChild(container);
      return;
    }

    // Top action bar
    const topBar = document.createElement('div');
    topBar.style.display = 'flex';
    topBar.style.justifyContent = 'space-between';
    topBar.style.alignItems = 'center';
    topBar.style.marginBottom = '24px';
    topBar.innerHTML = `
      <a href="#projects" class="sz-btn sz-btn-ghost sz-btn-sm">← プロジェクト一覧に戻る</a>
      <div style="display: flex; gap: 8px;">
        <button type="button" class="sz-btn sz-btn-sm" id="btnEditProject">編集</button>
        <button type="button" class="sz-btn sz-btn-danger sz-btn-sm" id="btnDeleteProject">削除</button>
      </div>
    `;
    container.appendChild(topBar);

    // Main Card
    const card = document.createElement('div');
    card.className = 'sz-card';
    card.style.marginBottom = '28px';

    const header = document.createElement('div');
    header.style.display = 'flex';
    header.style.justifyContent = 'space-between';
    header.style.alignItems = 'flex-start';
    header.style.gap = '16px';
    header.style.marginBottom = '16px';

    const titleWrap = document.createElement('div');
    const title = document.createElement('h2');
    title.className = 'sz-deck-title';
    title.style.fontSize = '20px';
    title.textContent = project.name;
    titleWrap.appendChild(title);

    const meta = document.createElement('div');
    meta.className = 'sz-mono sz-text-dim';
    meta.style.fontSize = '11px';
    meta.textContent = `作成: ${formatDateTime(project.createdAt)} · 更新: ${formatDateTime(project.updatedAt)}`;
    titleWrap.appendChild(meta);

    const statusBadge = document.createElement('span');
    statusBadge.className = `sz-status sz-status-${project.status}`;
    statusBadge.setAttribute('data-status', project.status);
    statusBadge.textContent = PROJECT_STATUS_LABELS[project.status] || project.status;

    header.appendChild(titleWrap);
    header.appendChild(statusBadge);
    card.appendChild(header);

    // Next Action Card (if present)
    if (project.nextAction) {
      const nextBox = document.createElement('div');
      nextBox.style.padding = '12px 16px';
      nextBox.style.backgroundColor = 'var(--sz-bg-alt)';
      nextBox.style.borderLeft = '3px solid var(--sz-accent)';
      nextBox.style.borderRadius = 'var(--sz-radius)';
      nextBox.style.marginBottom = '16px';
      nextBox.style.display = 'flex';
      nextBox.style.flexDirection = 'column';
      nextBox.style.gap = '4px';

      const nextLabel = document.createElement('span');
      nextLabel.className = 'sz-mono';
      nextLabel.style.fontSize = '10px';
      nextLabel.style.fontWeight = '600';
      nextLabel.style.color = 'var(--sz-accent)';
      nextLabel.textContent = 'NEXT ACTION';

      const nextVal = document.createElement('div');
      nextVal.style.fontSize = '14px';
      nextVal.style.color = '#ffffff';
      nextVal.style.fontWeight = '500';
      nextVal.textContent = project.nextAction;

      nextBox.appendChild(nextLabel);
      nextBox.appendChild(nextVal);
      card.appendChild(nextBox);
    }

    // Description
    const descBox = document.createElement('div');
    descBox.style.padding = '18px 20px';
    descBox.style.backgroundColor = 'var(--sz-bg-alt)';
    descBox.style.borderRadius = 'var(--sz-radius)';
    descBox.style.border = '1px solid var(--sz-border)';
    descBox.style.fontSize = '14px';
    descBox.style.lineHeight = '1.7';
    descBox.style.whiteSpace = 'pre-wrap';
    descBox.style.wordBreak = 'break-word';

    if (project.description) {
      descBox.textContent = project.description;
    } else {
      const placeholder = document.createElement('span');
      placeholder.className = 'sz-text-muted';
      placeholder.textContent = '（説明はありません）';
      descBox.appendChild(placeholder);
    }
    card.appendChild(descBox);
    container.appendChild(card);

    // Related Ideas section
    const relIdeas = (project.relatedIdeaIds || [])
      .map(iid => store.getIdeaById(iid))
      .filter(Boolean);

    const relSection = document.createElement('div');
    relSection.className = 'sz-deck-section';
    relSection.innerHTML = `
      <h3 class="sz-deck-section-title"><span class="sz-mono">RELATED IDEAS (${relIdeas.length})</span></h3>
    `;

    if (relIdeas.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'sz-empty';
      empty.textContent = '関連付けられたアイデアはありません。「編集」ボタンから既存のアイデアを関連付けることができます。';
      relSection.appendChild(empty);
    } else {
      const grid = document.createElement('div');
      grid.className = 'sz-idea-grid';
      relIdeas.forEach(idea => {
        grid.appendChild(createIdeaCardElement(idea));
      });
      relSection.appendChild(grid);
    }
    container.appendChild(relSection);

    // Handlers
    topBar.querySelector('#btnEditProject').addEventListener('click', () => {
      const allIdeas = store.getIdeas();

      const formHtml = `
        <div class="sz-form-group">
          <label class="sz-label" for="editProjName">プロジェクト名 <span style="color:var(--sz-danger)">*</span></label>
          <input class="sz-input" id="editProjName" name="name" maxlength="200" required value="${esc(project.name)}">
        </div>
        <div class="sz-form-group">
          <label class="sz-label" for="editProjStatus">ステータス</label>
          <select class="sz-select" id="editProjStatus" name="status">
            ${VALID_PROJECT_STATUSES.map(st => `
              <option value="${st}" ${project.status === st ? 'selected' : ''}>${PROJECT_STATUS_LABELS[st]}</option>
            `).join('')}
          </select>
        </div>
        <div class="sz-form-group">
          <label class="sz-label" for="editProjNext">次にやること</label>
          <input class="sz-input" id="editProjNext" name="nextAction" maxlength="200" value="${esc(project.nextAction || '')}" placeholder="例: 仕様書の草案作成">
        </div>
        <div class="sz-form-group">
          <label class="sz-label" for="editProjDesc">説明</label>
          <textarea class="sz-textarea" id="editProjDesc" name="description" rows="5" maxlength="5000">${esc(project.description || '')}</textarea>
        </div>
        <div class="sz-form-group">
          <label class="sz-label">関連アイデア</label>
          <div id="editProjIdeasWrap" style="max-height: 180px; overflow-y: auto; background-color: var(--sz-bg-alt); border: 1px solid var(--sz-border); border-radius: var(--sz-radius); padding: 10px 14px; display: flex; flex-direction: column; gap: 8px;">
            ${allIdeas.length === 0 ? `
              <span class="sz-text-muted" style="font-size: 12px;">（登録されたアイデアはありません）</span>
            ` : allIdeas.map(idea => `
              <label style="display: flex; align-items: center; gap: 8px; font-size: 13px; cursor: pointer;">
                <input type="checkbox" name="relatedIdea" value="${esc(idea.id)}" ${(project.relatedIdeaIds || []).includes(idea.id) ? 'checked' : ''}>
                <span class="sz-truncate">${esc(idea.title)}</span>
                <span class="sz-status sz-status-${idea.status}" style="font-size: 10px; margin-left: auto;">${IDEA_STATUS_LABELS[idea.status]}</span>
              </label>
            `).join('')}
          </div>
        </div>
      `;

      showModal({
        title: 'プロジェクトを編集',
        bodyHtml: formHtml,
        onSubmit: (formData, form) => {
          const name = formData.get('name');
          const status = formData.get('status');
          const nextAction = formData.get('nextAction');
          const description = formData.get('description');

          const checkedCheckboxes = form.querySelectorAll('input[name="relatedIdea"]:checked');
          const relatedIdeaIds = Array.from(checkedCheckboxes).map(cb => cb.value);

          store.updateProject(project.id, {
            name,
            status,
            nextAction,
            description,
            relatedIdeaIds
          });

          renderProjectDetail(project.id);
        }
      });
    });

    topBar.querySelector('#btnDeleteProject').addEventListener('click', () => {
      showConfirm({
        message: `プロジェクト「${project.name}」を削除しますか？\n\nアイデア自体は削除されません。この操作は取り消せません。`,
        confirmText: '削除',
        isDanger: true,
        onConfirm: () => {
          store.deleteProject(project.id);
          window.location.hash = '#projects';
        }
      });
    });

    main.innerHTML = '';
    main.appendChild(container);
  }

  // --------------------------------------------------------------------------
  // 5.6 SEARCH VIEW (#search)
  // --------------------------------------------------------------------------
  function renderSearch() {
    const main = $('#szMain');
    if (!main) return;

    const container = document.createElement('div');
    container.className = 'sz-fade-in';

    // Header
    const header = document.createElement('div');
    header.className = 'sz-deck-header';
    header.innerHTML = `
      <div>
        <h2 class="sz-deck-title">GLOBAL SEARCH</h2>
        <div class="sz-deck-meta">アイデアとプロジェクトを横断検索</div>
      </div>
    `;
    container.appendChild(header);

    // Search bar
    const searchBar = document.createElement('div');
    searchBar.className = 'sz-search-bar';
    searchBar.innerHTML = `
      <span class="sz-search-icon">🔍</span>
      <input type="search" class="sz-input sz-search-input" id="globalSearchInput" placeholder="キーワードを入力（タイトル、本文、タグ、プロジェクト名など）..." autocomplete="off">
    `;
    container.appendChild(searchBar);

    // Results container
    const resultsContainer = document.createElement('div');
    resultsContainer.className = 'sz-fade-in';
    container.appendChild(resultsContainer);

    const input = searchBar.querySelector('#globalSearchInput');

    function createSearchResultItem(item, type, query) {
      const el = document.createElement('div');
      el.className = 'sz-search-item';
      el.setAttribute('role', 'button');
      el.setAttribute('tabindex', '0');

      const headerDiv = document.createElement('div');
      headerDiv.className = 'sz-search-item-header';

      const titleWrap = document.createElement('div');
      titleWrap.style.display = 'flex';
      titleWrap.style.alignItems = 'center';
      titleWrap.style.gap = '8px';
      titleWrap.style.flexWrap = 'wrap';

      const typeBadge = document.createElement('span');
      typeBadge.className = 'sz-mono';
      typeBadge.style.fontSize = '10px';
      typeBadge.style.padding = '2px 6px';
      typeBadge.style.borderRadius = '3px';
      typeBadge.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
      typeBadge.style.color = 'var(--sz-text-dim)';
      typeBadge.style.textTransform = 'uppercase';
      typeBadge.textContent = type === 'idea' ? 'IDEA' : 'PROJECT';
      titleWrap.appendChild(typeBadge);

      const title = document.createElement('h4');
      title.className = 'sz-search-item-title';
      title.appendChild(createHighlightedSnippet(type === 'idea' ? item.title : item.name, query));
      titleWrap.appendChild(title);

      const statusBadge = document.createElement('span');
      const labels = type === 'idea' ? IDEA_STATUS_LABELS : PROJECT_STATUS_LABELS;
      statusBadge.className = `sz-status sz-status-${item.status}`;
      statusBadge.setAttribute('data-status', item.status);
      statusBadge.textContent = labels[item.status] || item.status;

      headerDiv.appendChild(titleWrap);
      headerDiv.appendChild(statusBadge);
      el.appendChild(headerDiv);

      // Snippet
      const snippetText = type === 'idea'
        ? item.body
        : (item.nextAction ? `NEXT: ${item.nextAction} — ${item.description || ''}` : item.description);

      if (snippetText) {
        const desc = document.createElement('div');
        desc.className = 'sz-search-item-desc';
        desc.appendChild(createHighlightedSnippet(snippetText, query));
        el.appendChild(desc);
      }

      // Tags for idea
      if (type === 'idea' && item.tags && item.tags.length > 0) {
        const tagsDiv = document.createElement('div');
        tagsDiv.className = 'sz-tags';
        tagsDiv.style.marginTop = '4px';
        item.tags.forEach(t => {
          const tag = document.createElement('span');
          tag.className = 'sz-tag';
          tag.appendChild(createHighlightedSnippet(t, query));
          tagsDiv.appendChild(tag);
        });
        el.appendChild(tagsDiv);
      }

      function navigate() {
        window.location.hash = type === 'idea' ? `#idea/${item.id}` : `#project/${item.id}`;
      }
      el.addEventListener('click', navigate);
      el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          navigate();
        }
      });

      return el;
    }

    function executeSearch() {
      const q = (input.value || '').trim();
      resultsContainer.innerHTML = '';

      if (!q) {
        const empty = document.createElement('div');
        empty.className = 'sz-empty';
        empty.innerHTML = `
          <span class="sz-empty-icon">⊘</span>
          <span>キーワードを入力して検索してください</span>
          <span class="sz-empty-hint">アイデアのタイトル・本文・タグ、プロジェクト名・説明・次のアクションを検索します</span>
        `;
        resultsContainer.appendChild(empty);
        return;
      }

      const { ideas, projects } = store.search(q);
      const total = ideas.length + projects.length;

      if (total === 0) {
        const empty = document.createElement('div');
        empty.className = 'sz-empty';
        empty.innerHTML = `
          <span class="sz-empty-icon">✕</span>
          <span id="noResultsText"></span>
          <span class="sz-empty-hint">別のキーワードや短い単語でお試しください</span>
        `;
        setText(empty.querySelector('#noResultsText'), `「${q}」に一致する結果は見つかりませんでした`);
        resultsContainer.appendChild(empty);
        return;
      }

      const countHeader = document.createElement('div');
      countHeader.className = 'sz-mono sz-text-dim';
      countHeader.style.fontSize = '12px';
      countHeader.style.marginBottom = '20px';
      countHeader.textContent = `${total} 件の結果が見つかりました（アイデア: ${ideas.length} 件, プロジェクト: ${projects.length} 件）`;
      resultsContainer.appendChild(countHeader);

      // Ideas Section
      if (ideas.length > 0) {
        const sec = document.createElement('div');
        sec.className = 'sz-deck-section';
        sec.innerHTML = `<h3 class="sz-deck-section-title"><span class="sz-mono">IDEAS (${ideas.length})</span></h3>`;

        const list = document.createElement('div');
        list.className = 'sz-search-results';
        ideas.forEach(idea => {
          list.appendChild(createSearchResultItem(idea, 'idea', q));
        });
        sec.appendChild(list);
        resultsContainer.appendChild(sec);
      }

      // Projects Section
      if (projects.length > 0) {
        const sec = document.createElement('div');
        sec.className = 'sz-deck-section';
        sec.innerHTML = `<h3 class="sz-deck-section-title"><span class="sz-mono">PROJECTS (${projects.length})</span></h3>`;

        const list = document.createElement('div');
        list.className = 'sz-search-results';
        projects.forEach(project => {
          list.appendChild(createSearchResultItem(project, 'project', q));
        });
        sec.appendChild(list);
        resultsContainer.appendChild(sec);
      }
    }

    // Debounce 300ms
    let searchDebounceTimer = null;
    input.addEventListener('input', () => {
      clearTimeout(searchDebounceTimer);
      searchDebounceTimer = setTimeout(executeSearch, 300);
    });

    executeSearch();

    main.innerHTML = '';
    main.appendChild(container);

    setTimeout(() => {
      input.focus();
    }, 50);
  }

  // --------------------------------------------------------------------------
  // 5.7 BACKUP VIEW (#backup)
  // --------------------------------------------------------------------------
  function renderBackup() {
    const main = $('#szMain');
    if (!main) return;

    const stats = store.getStats();

    const container = document.createElement('div');
    container.className = 'sz-fade-in';

    // Header
    const header = document.createElement('div');
    header.className = 'sz-deck-header';
    header.innerHTML = `
      <div>
        <h2 class="sz-deck-title">DATA BACKUP & RESTORE</h2>
        <div class="sz-deck-meta">ローカルデータの管理・移行</div>
      </div>
    `;
    container.appendChild(header);

    // Backup Grid
    const grid = document.createElement('div');
    grid.className = 'sz-backup-grid';

    // Export Section
    const exportSec = document.createElement('div');
    exportSec.className = 'sz-backup-section';
    exportSec.innerHTML = `
      <h3 class="sz-backup-title">
        <span class="sz-mono">EXPORT</span>
        <span>JSONバックアップの保存</span>
      </h3>
      <p class="sz-backup-desc">
        現在のワークスペースデータ（アイデアとプロジェクト）をJSON形式のファイルとしてダウンロードします。定期的なバックアップを推奨します。
      </p>
      <div style="background-color: var(--sz-bg-alt); border: 1px solid var(--sz-border); border-radius: var(--sz-radius); padding: 14px 16px; display: flex; flex-direction: column; gap: 6px; font-family: var(--sz-mono); font-size: 12px;">
        <div style="display: flex; justify-content: space-between;">
          <span class="sz-text-dim">アイデア数:</span>
          <span>${stats.totalIdeas} 件</span>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span class="sz-text-dim">プロジェクト数:</span>
          <span>${stats.totalProjects} 件</span>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span class="sz-text-dim">最終更新日時:</span>
          <span>${formatDateTime(store._data.lastUpdated)}</span>
        </div>
      </div>
      <div style="margin-top: auto; padding-top: 10px;">
        <button type="button" class="sz-btn sz-btn-primary" id="btnExportJson" style="width: 100%;">
          ↓ エクスポート (JSON)
        </button>
      </div>
    `;
    grid.appendChild(exportSec);

    // Import Section
    const importSec = document.createElement('div');
    importSec.className = 'sz-backup-section';
    importSec.innerHTML = `
      <h3 class="sz-backup-title">
        <span class="sz-mono">IMPORT</span>
        <span>JSONバックアップの復元</span>
      </h3>
      <p class="sz-backup-desc">
        以前にエクスポートしたJSONファイルを読み込み、ワークスペースを復元します。
      </p>
      
      <label class="sz-file-drop" id="fileDropArea">
        <input type="file" id="importFileInput" accept=".json" class="sz-hidden">
        <span class="sz-file-drop-icon">📁</span>
        <span class="sz-file-drop-text" id="fileDropText">JSONファイルを選択、またはドラッグ＆ドロップ</span>
        <span class="sz-file-drop-sub">.json ファイル対応</span>
      </label>

      <div id="importError" class="sz-hidden" style="padding: 10px 14px; background-color: var(--sz-danger-dim); border: 1px solid var(--sz-danger); border-radius: var(--sz-radius); color: var(--sz-danger); font-size: 12px; line-height: 1.5;"></div>

      <div id="importPreview" class="sz-import-preview sz-hidden"></div>

      <div style="margin-top: auto; padding-top: 10px;">
        <button type="button" class="sz-btn sz-btn-danger" id="btnExecuteImport" style="width: 100%;" disabled>
          インポートを実行 (データを上書き)
        </button>
      </div>
    `;
    grid.appendChild(importSec);

    container.appendChild(grid);

    // Info card
    const infoCard = document.createElement('div');
    infoCard.className = 'sz-card';
    infoCard.style.marginTop = '24px';
    infoCard.style.borderLeft = '3px solid var(--sz-border-light)';
    infoCard.innerHTML = `
      <p class="sz-mono sz-text-dim" style="font-size: 11px; margin: 0; line-height: 1.6;">
        LOCAL WORKSPACE · データはこのブラウザの localStorage に保存されています。他の端末やブラウザとは同期されません。ブラウザの履歴やCookie・サイトデータを消去するとデータが消去される可能性があるため、定期的にJSONバックアップを保存してください。
      </p>
    `;
    container.appendChild(infoCard);

    // Export Handler
    exportSec.querySelector('#btnExportJson').addEventListener('click', () => {
      try {
        const data = store.exportData();
        const jsonStr = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8' });
        const url = URL.createObjectURL(blob);

        const now = new Date();
        const dateStr = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;
        const fileName = `studio-zero-backup-${dateStr}.json`;

        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } catch (err) {
        alert('エクスポートに失敗しました: ' + err.message);
      }
    });

    // Import Handler
    const fileInput = importSec.querySelector('#importFileInput');
    const fileDropArea = importSec.querySelector('#fileDropArea');
    const fileDropText = importSec.querySelector('#fileDropText');
    const importError = importSec.querySelector('#importError');
    const importPreview = importSec.querySelector('#importPreview');
    const btnExecuteImport = importSec.querySelector('#btnExecuteImport');

    let parsedImportData = null;

    function handleFile(file) {
      if (!file) return;

      importError.classList.add('sz-hidden');
      importPreview.classList.add('sz-hidden');
      btnExecuteImport.disabled = true;
      parsedImportData = null;

      if (!file.name.endsWith('.json') && file.type !== 'application/json') {
        setText(importError, 'エラー: .json 形式のファイルを選択してください。');
        importError.classList.remove('sz-hidden');
        return;
      }

      setText(fileDropText, `選択中: ${file.name}`);

      const reader = new FileReader();
      reader.onload = function(e) {
        try {
          const raw = e.target.result;
          const parsed = JSON.parse(raw);

          // Validate
          if (!parsed || typeof parsed !== 'object') throw new Error('無効なJSONフォーマットです');
          if (!Array.isArray(parsed.ideas)) throw new Error('ideas配列が見つかりません');
          if (!Array.isArray(parsed.projects)) throw new Error('projects配列が見つかりません');

          for (const item of parsed.ideas) {
            if (!item.id || !item.title) throw new Error('不正な形式のアイデアが含まれています');
          }
          for (const item of parsed.projects) {
            if (!item.id || !item.name) throw new Error('不正な形式のプロジェクトが含まれています');
          }

          parsedImportData = parsed;

          // Render Preview safely
          importPreview.innerHTML = `
            <div style="font-weight: 600; color: #ffffff; margin-bottom: 8px;">✓ 有効なバックアップデータです</div>
            <div>ファイル名: <span data-bind="fname"></span></div>
            <div>アイデア数: <span data-bind="ideas"></span> 件</div>
            <div>プロジェクト数: <span data-bind="projects"></span> 件</div>
            <div>エクスポート日時: <span data-bind="exp"></span></div>
            <div>スキーマバージョン: <span data-bind="ver"></span></div>
          `;
          safeRender(importPreview, importPreview.innerHTML, {
            fname: file.name,
            ideas: parsed.ideas.length,
            projects: parsed.projects.length,
            exp: formatDateTime(parsed.exportedAt || parsed.lastUpdated),
            ver: `v${parsed.schemaVersion || 1}`
          });
          importPreview.classList.remove('sz-hidden');
          btnExecuteImport.disabled = false;
        } catch (err) {
          setText(importError, `エラー: ${err.message}`);
          importError.classList.remove('sz-hidden');
        }
      };
      reader.onerror = function() {
        setText(importError, 'ファイルの読み込みに失敗しました。');
        importError.classList.remove('sz-hidden');
      };
      reader.readAsText(file, 'UTF-8');
    }

    fileInput.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      handleFile(file);
    });

    // Drag and drop
    fileDropArea.addEventListener('dragover', (e) => {
      e.preventDefault();
      fileDropArea.classList.add('dragover');
    });
    fileDropArea.addEventListener('dragleave', () => {
      fileDropArea.classList.remove('dragover');
    });
    fileDropArea.addEventListener('drop', (e) => {
      e.preventDefault();
      fileDropArea.classList.remove('dragover');
      const file = e.dataTransfer.files && e.dataTransfer.files[0];
      handleFile(file);
    });

    btnExecuteImport.addEventListener('click', () => {
      if (!parsedImportData) return;

      showConfirm({
        message: `この操作は現在のデータをすべて置き換えます。\n\n現在のデータ（アイデア: ${stats.totalIdeas}件, プロジェクト: ${stats.totalProjects}件）は失われます。\n\n続けますか？`,
        confirmText: '上書きインポートを実行',
        isDanger: true,
        onConfirm: () => {
          try {
            store.importData(parsedImportData);
            alert('データを正常にインポートしました。');
            renderBackup();
          } catch (err) {
            alert('インポートに失敗しました: ' + err.message);
          }
        }
      });
    });

    main.innerHTML = '';
    main.appendChild(container);
  }

  // ==========================================================================
  // 6. ROUTER
  // ==========================================================================

  function parseHash() {
    let hash = window.location.hash || '';
    if (hash.startsWith('#')) hash = hash.slice(1);
    if (!hash || hash === 'deck') {
      return { view: 'deck', id: null };
    }
    if (hash === 'ideas') {
      return { view: 'ideas', id: null };
    }
    if (hash.startsWith('idea/')) {
      return { view: 'ideaDetail', id: hash.slice(5) };
    }
    if (hash === 'projects') {
      return { view: 'projects', id: null };
    }
    if (hash.startsWith('project/')) {
      return { view: 'projectDetail', id: hash.slice(8) };
    }
    if (hash === 'search') {
      return { view: 'search', id: null };
    }
    if (hash === 'backup') {
      return { view: 'backup', id: null };
    }
    return { view: 'deck', id: null };
  }

  function updateActiveNav(view) {
    const navItems = $$('.sz-nav-item');
    let targetView = view;
    if (view === 'ideaDetail') targetView = 'ideas';
    if (view === 'projectDetail') targetView = 'projects';

    navItems.forEach(item => {
      if (item.getAttribute('data-view') === targetView) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }

  function handleRoute() {
    const route = parseHash();
    updateActiveNav(route.view);

    // Close mobile sidebar on navigation
    closeMobileSidebar();

    switch (route.view) {
      case 'deck':
        renderDeck();
        break;
      case 'ideas':
        renderIdeas();
        break;
      case 'ideaDetail':
        renderIdeaDetail(route.id);
        break;
      case 'projects':
        renderProjects();
        break;
      case 'projectDetail':
        renderProjectDetail(route.id);
        break;
      case 'search':
        renderSearch();
        break;
      case 'backup':
        renderBackup();
        break;
      default:
        renderDeck();
        break;
    }
  }

  // ==========================================================================
  // 7. MOBILE MENU HANDLER
  // ==========================================================================

  function closeMobileSidebar() {
    const sidebar = $('#szSidebar');
    const app = $('#szApp');
    const menuBtn = $('#szMenuBtn');
    if (sidebar) {
      sidebar.classList.remove('sz-sidebar-open');
      sidebar.classList.remove('open');
    }
    if (app) {
      app.classList.remove('sz-sidebar-open');
    }
    if (menuBtn) {
      menuBtn.setAttribute('aria-expanded', 'false');
    }
  }

  function toggleMobileSidebar() {
    const sidebar = $('#szSidebar');
    const app = $('#szApp');
    const menuBtn = $('#szMenuBtn');
    if (!sidebar) return;

    const isOpen = sidebar.classList.contains('sz-sidebar-open') || (app && app.classList.contains('sz-sidebar-open'));
    if (isOpen) {
      closeMobileSidebar();
    } else {
      sidebar.classList.add('sz-sidebar-open');
      sidebar.classList.add('open');
      if (app) app.classList.add('sz-sidebar-open');
      if (menuBtn) menuBtn.setAttribute('aria-expanded', 'true');
    }
  }

  function initMobileMenu() {
    const menuBtn = $('#szMenuBtn');
    if (menuBtn) {
      menuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMobileSidebar();
      });
    }

    // Add backdrop element if it doesn't already exist
    let backdrop = $('.sz-backdrop');
    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.className = 'sz-backdrop';
      const app = $('#szApp') || document.body;
      app.appendChild(backdrop);
    }
    backdrop.addEventListener('click', closeMobileSidebar);

    // Clicking on main area also closes sidebar on mobile
    const main = $('#szMain');
    if (main) {
      main.addEventListener('click', () => {
        const sidebar = $('#szSidebar');
        if (sidebar && (sidebar.classList.contains('sz-sidebar-open') || sidebar.classList.contains('open'))) {
          closeMobileSidebar();
        }
      });
    }

    // Escape closes mobile menu
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeMobileSidebar();
      }
    });
  }

  // ==========================================================================
  // 8. INIT
  // ==========================================================================

  function init() {
    store = new StudioZeroStore();

    // Nav click handlers
    const navItems = $$('.sz-nav-item');
    navItems.forEach(item => {
      item.addEventListener('click', () => {
        const view = item.getAttribute('data-view');
        if (view) {
          window.location.hash = `#${view}`;
        }
      });
    });

    initMobileMenu();

    // Hash router listeners
    window.addEventListener('hashchange', handleRoute);

    // Initial render
    handleRoute();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
