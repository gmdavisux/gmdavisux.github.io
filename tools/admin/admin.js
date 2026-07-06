const state = {
  sitePort: 4000,
  collections: [],
  pages: [],
  currentCollection: null,
  collectionItems: [],
  currentPage: null,
  pageContent: '',
  dragIndex: null,
};

async function api(path, options = {}) {
  const response = await fetch(path, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || response.statusText);
  }
  return data;
}

function setStatus(id, message, type = '') {
  const el = document.getElementById(id);
  el.textContent = message;
  el.className = `status ${type}`.trim();
}

function switchPanel(name) {
  document.querySelectorAll('nav button').forEach((button) => {
    button.classList.toggle('active', button.dataset.panel === name);
  });
  document.querySelectorAll('.panel').forEach((panel) => {
    panel.classList.toggle('active', panel.id === `panel-${name}`);
  });
}

function renderCollectionTable() {
  const tbody = document.querySelector('#collection-table tbody');
  tbody.innerHTML = '';

  state.collectionItems.forEach((item, index) => {
    const row = document.createElement('tr');
    row.draggable = true;
    row.dataset.index = String(index);
    row.innerHTML = `
      <td>::</td>
      <td><input type="text" data-field="name" value="${escapeAttr(item.name || '')}"></td>
      <td><input type="text" data-field="url" value="${escapeAttr(item.url || '')}"></td>
      <td><input type="text" data-field="src" value="${escapeAttr(item.src || '')}"></td>
      <td><input type="text" data-field="alt" value="${escapeAttr(item.alt || '')}"></td>
      <td><input type="text" data-field="description" value="${escapeAttr(item.description || '')}"></td>
      <td><button type="button" class="btn secondary" data-action="remove">Remove</button></td>
    `;

    row.addEventListener('dragstart', () => {
      state.dragIndex = index;
      row.classList.add('dragging');
    });

    row.addEventListener('dragend', () => {
      state.dragIndex = null;
      row.classList.remove('dragging');
    });

    row.addEventListener('dragover', (event) => {
      event.preventDefault();
    });

    row.addEventListener('drop', (event) => {
      event.preventDefault();
      const targetIndex = Number(row.dataset.index);
      if (state.dragIndex === null || state.dragIndex === targetIndex) return;
      const [moved] = state.collectionItems.splice(state.dragIndex, 1);
      state.collectionItems.splice(targetIndex, 0, moved);
      renderCollectionTable();
    });

    row.querySelector('[data-action="remove"]').addEventListener('click', () => {
      state.collectionItems.splice(index, 1);
      renderCollectionTable();
    });

    row.querySelectorAll('input').forEach((input) => {
      input.addEventListener('input', () => {
        const field = input.dataset.field;
        state.collectionItems[index][field] = input.value;
        if (field === 'src' && !state.collectionItems[index].alt) {
          // no-op; alt stays blank until user fills it
        }
        delete state.collectionItems[index].x_words;
      });
    });

    tbody.appendChild(row);
  });
}

function escapeAttr(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;');
}

function readCollectionFromTable() {
  return state.collectionItems.map((item) => {
    const cleaned = { ...item };
    Object.keys(cleaned).forEach((key) => {
      if (cleaned[key] === '') delete cleaned[key];
    });
    return cleaned;
  });
}

async function loadCollections() {
  state.collections = await api('/api/collections');
  const select = document.getElementById('collection-select');
  select.innerHTML = state.collections
    .map((name) => `<option value="${name}">${name}</option>`)
    .join('');

  if (state.collections.length) {
    select.value = state.collections[0];
    await loadCollection(select.value);
  } else {
    state.currentCollection = null;
    state.collectionItems = [];
    renderCollectionTable();
    updateCollectionHomeLink(null);
    updateCollectionActions(false);
  }
}

function updateCollectionActions(enabled) {
  document.getElementById('delete-collection').disabled = !enabled;
}

function updateCollectionHomeLink(name) {
  const link = document.getElementById('collection-home-link');
  if (!name) {
    link.hidden = true;
    return;
  }

  link.hidden = false;
  link.href = `http://localhost:${state.sitePort}/?set=${encodeURIComponent(name)}`;
}

async function loadCollection(name) {
  state.currentCollection = name;
  state.collectionItems = await api(`/api/collections/${name}`);
  renderCollectionTable();
  updateCollectionHomeLink(name);
  updateCollectionActions(true);
  setStatus('collection-status', `Loaded ${name}.json`);
}

async function saveCollection() {
  const items = readCollectionFromTable();
  await api(`/api/collections/${state.currentCollection}`, {
    method: 'PUT',
    body: JSON.stringify(items),
  });
  state.collectionItems = items;
  setStatus('collection-status', `Saved ${state.currentCollection}.json`, 'success');
}

async function duplicateCollection() {
  const target = prompt('New set name (e.g. client-acme):', `${state.currentCollection}-copy`);
  if (!target) return;

  const result = await api(`/api/collections/${state.currentCollection}/duplicate`, {
    method: 'POST',
    body: JSON.stringify({ target }),
  });

  await loadCollections();
  document.getElementById('collection-select').value = result.name;
  await loadCollection(result.name);
  setStatus('collection-status', `Created ${result.name}.json`, 'success');
}

async function deleteCollection() {
  if (!state.currentCollection) return;

  const name = state.currentCollection;
  if (!confirm(`Delete "${name}.json"? This cannot be undone.`)) return;

  await api(`/api/collections/${name}`, { method: 'DELETE' });
  await loadCollections();
  setStatus('collection-status', `Deleted ${name}.json`, 'success');
}

function addCollectionItem() {
  state.collectionItems.push({
    name: 'New item',
    url: '?page=',
    description: '',
  });
  renderCollectionTable();
}

async function loadPages() {
  state.pages = await api('/api/pages');
  const select = document.getElementById('page-select');
  select.innerHTML = state.pages
    .map((name) => `<option value="${name}">${name}</option>`)
    .join('');

  if (state.pages.length) {
    select.value = state.pages[0];
    await loadPage(select.value);
  }
}

async function loadPage(name) {
  const data = await api(`/api/pages/${name}`);
  state.currentPage = name;
  state.pageContent = data.content;
  document.getElementById('page-editor').value = data.content;
  setStatus('page-status', `Loaded pages/${name}.html`);
}

async function savePage() {
  const content = document.getElementById('page-editor').value;
  await api(`/api/pages/${state.currentPage}`, {
    method: 'PUT',
    body: JSON.stringify({ content }),
  });
  state.pageContent = content;
  setStatus('page-status', `Saved pages/${state.currentPage}.html`, 'success');
}

async function createPage() {
  const name = prompt('New page slug (e.g. my-project):');
  if (!name) return;

  const template = await api('/api/template/page');
  const result = await api('/api/pages', {
    method: 'POST',
    body: JSON.stringify({ name, content: template.content }),
  });

  await loadPages();
  document.getElementById('page-select').value = result.name;
  await loadPage(result.name);
  setStatus('page-status', `Created pages/${result.name}.html`, 'success');
}

async function addPageToCollection() {
  if (!state.currentPage || !state.currentCollection) return;

  const name = prompt('Display name in collection:', state.currentPage);
  const description = prompt('Short description:', '');
  const src = prompt('Thumbnail image path (optional):', 'images/');

  await api(`/api/collections/${state.currentCollection}/add-page`, {
    method: 'POST',
    body: JSON.stringify({
      page: state.currentPage,
      item: { name, description, src, alt: '' },
    }),
  });

  await loadCollection(state.currentCollection);
  setStatus('collection-status', `Added ${state.currentPage} to ${state.currentCollection}.json`, 'success');
}

async function runValidation() {
  const report = await api('/api/validate');
  const container = document.getElementById('validation-results');
  container.innerHTML = '';

  if (!report.issues.length) {
    container.innerHTML = '<p class="status success">No issues found.</p>';
  } else {
    report.issues.forEach((issue) => {
      const div = document.createElement('div');
      div.className = `issue ${issue.level}`;
      div.textContent = issue.message;
      container.appendChild(div);
    });
  }

  const errors = report.issues.filter((issue) => issue.level === 'error').length;
  const warns = report.issues.filter((issue) => issue.level === 'warn').length;
  setStatus(
    'validation-summary',
    `${report.collections} collections, ${report.pages} pages — ${errors} errors, ${warns} warnings`
  );
}

function loadPreview() {
  const path = document.getElementById('preview-path').value || '/';
  const frame = document.getElementById('preview-frame');
  frame.src = `http://localhost:${state.sitePort}${path.startsWith('/') ? path : `/${path}`}`;
}

function bindEvents() {
  document.querySelectorAll('nav button').forEach((button) => {
    button.addEventListener('click', () => switchPanel(button.dataset.panel));
  });

  document.getElementById('collection-select').addEventListener('change', (event) => {
    loadCollection(event.target.value);
  });

  document.getElementById('save-collection').addEventListener('click', () => {
    saveCollection().catch((error) => setStatus('collection-status', error.message, 'error'));
  });

  document.getElementById('duplicate-collection').addEventListener('click', () => {
    duplicateCollection().catch((error) => setStatus('collection-status', error.message, 'error'));
  });

  document.getElementById('add-collection-item').addEventListener('click', addCollectionItem);

  document.getElementById('delete-collection').addEventListener('click', () => {
    deleteCollection().catch((error) => setStatus('collection-status', error.message, 'error'));
  });

  document.getElementById('page-select').addEventListener('change', (event) => {
    loadPage(event.target.value);
  });

  document.getElementById('save-page').addEventListener('click', () => {
    savePage().catch((error) => setStatus('page-status', error.message, 'error'));
  });

  document.getElementById('new-page').addEventListener('click', () => {
    createPage().catch((error) => setStatus('page-status', error.message, 'error'));
  });

  document.getElementById('add-page-to-collection').addEventListener('click', () => {
    addPageToCollection().catch((error) => setStatus('collection-status', error.message, 'error'));
  });

  document.getElementById('run-validation').addEventListener('click', () => {
    runValidation().catch((error) => setStatus('validation-summary', error.message, 'error'));
  });

  document.getElementById('load-preview').addEventListener('click', loadPreview);
}

async function init() {
  const config = await api('/api/config');
  state.sitePort = config.sitePort;
  document.getElementById('open-site').href = `http://localhost:${state.sitePort}/`;

  bindEvents();
  await Promise.all([loadCollections(), loadPages()]);
  loadPreview();
}

init().catch((error) => {
  document.body.insertAdjacentHTML(
    'beforeend',
    `<p class="status error" style="padding:1rem">Failed to start admin: ${error.message}</p>`
  );
});