const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const PORT = process.env.ADMIN_PORT || 4001;
const SITE_PORT = process.env.SITE_PORT || 4000;
const SITE_ROOT = path.resolve(__dirname, '../..');
const JS_DIR = path.join(SITE_ROOT, 'js');
const PAGES_DIR = path.join(SITE_ROOT, 'pages');
const IMAGES_DIR = path.join(SITE_ROOT, 'images');

const NON_COLLECTION_JSON = new Set(['testimonials.json']);

const PAGE_TEMPLATE = `<div class="case-study container">
  <header class="case-study__intro">
    <h1>Project Title</h1>
    <p class="case-study__meta">Company | Role | Year</p>
    <p>Intro paragraph describing the project.</p>
  </header>
  <section class="case-study__section">
    <h2>Section title</h2>
    <div class="case-study__split">
      <img src="images/placeholder.png" alt="Describe this screenshot" class="screenshot-frame">
      <p>Supporting copy for the hero image.</p>
    </div>
  </section>
</div>
`;

const app = express();
app.use(express.json({ limit: '2mb' }));
app.use(express.static(__dirname));

function collectionPath(name) {
  const safe = name.replace(/\.json$/i, '').replace(/[^a-z0-9_-]/gi, '');
  return path.join(JS_DIR, `${safe}.json`);
}

function pagePath(name) {
  const safe = name.replace(/\.html$/i, '').replace(/[^a-z0-9_-]/gi, '');
  return path.join(PAGES_DIR, `${safe}.html`);
}

function normalizePageSlug(url) {
  if (!url || url === './') return '';
  const parts = String(url).split('=');
  return parts.length > 1 ? parts[1].toLowerCase() : String(url).toLowerCase();
}

async function listCollectionNames() {
  const files = await fs.readdir(JS_DIR);
  return files
    .filter((file) => file.endsWith('.json') && !NON_COLLECTION_JSON.has(file))
    .map((file) => file.replace(/\.json$/, ''))
    .sort();
}

async function listPageNames() {
  const files = await fs.readdir(PAGES_DIR);
  return files
    .filter((file) => file.endsWith('.html'))
    .map((file) => file.replace(/\.html$/, ''))
    .sort();
}

async function readCollection(name) {
  const filePath = collectionPath(name);
  const raw = await fs.readFile(filePath, 'utf8');
  return JSON.parse(raw);
}

async function buildValidationReport() {
  const issues = [];
  const collectionNames = await listCollectionNames();
  const pageNames = await listPageNames();
  const pageSet = new Set(pageNames);
  const referencedPages = new Set();

  for (const name of collectionNames) {
    const items = await readCollection(name);

    if (!Array.isArray(items)) {
      issues.push({ level: 'error', message: `${name}.json is not an array` });
      continue;
    }

    for (let index = 0; index < items.length; index++) {
      const item = items[index];
      const label = `${name}.json item ${index} (${item.name || 'unnamed'})`;

      if (!item.name) {
        issues.push({ level: 'error', message: `${label}: missing name` });
      }

      if (item.url === undefined || item.url === null) {
        issues.push({ level: 'error', message: `${label}: missing url` });
      }

      const slug = normalizePageSlug(item.url);
      if (slug) {
        referencedPages.add(slug);
        if (!pageSet.has(slug)) {
          issues.push({ level: 'error', message: `${label}: points to missing page "${slug}"` });
        }
      }

      if (item.src && !item.alt) {
        issues.push({ level: 'warn', message: `${label}: image missing alt text` });
      }

      if (item.src) {
        const imagePath = path.join(SITE_ROOT, item.src.split('?')[0]);
        try {
          await fs.access(imagePath);
        } catch {
          issues.push({ level: 'warn', message: `${label}: image not found at ${item.src}` });
        }
      }
    }
  }

  for (const page of pageNames) {
    if (page === 'aiux-behavior-studio-case-study') continue;
    if (!referencedPages.has(page)) {
      issues.push({ level: 'info', message: `Page "${page}" is not in any collection` });
    }
  }

  return {
    collections: collectionNames.length,
    pages: pageNames.length,
    issues: issues.sort((a, b) => {
      const order = { error: 0, warn: 1, info: 2 };
      return order[a.level] - order[b.level];
    }),
  };
}

app.get('/api/config', (_req, res) => {
  res.json({ sitePort: SITE_PORT, siteRoot: SITE_ROOT });
});

app.get('/api/collections', async (_req, res) => {
  try {
    res.json(await listCollectionNames());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/collections/:name', async (req, res) => {
  try {
    const items = await readCollection(req.params.name);
    res.json(items);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

app.put('/api/collections/:name', async (req, res) => {
  try {
    const filePath = collectionPath(req.params.name);
    const data = JSON.stringify(req.body, null, 4);
    await fs.writeFile(filePath, `${data}\n`, 'utf8');
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/collections/:name/duplicate', async (req, res) => {
  try {
    const source = req.params.name;
    const target = String(req.body.target || '').trim();
    if (!target) {
      return res.status(400).json({ error: 'target name is required' });
    }

    const items = await readCollection(source);
    const filePath = collectionPath(target);
    await fs.writeFile(filePath, `${JSON.stringify(items, null, 4)}\n`, 'utf8');
    res.json({ ok: true, name: target.replace(/\.json$/, '') });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/collections/:name', async (req, res) => {
  try {
    const filePath = collectionPath(req.params.name);
    await fs.unlink(filePath);
    res.json({ ok: true });
  } catch (error) {
    if (error.code === 'ENOENT') {
      return res.status(404).json({ error: 'Collection not found' });
    }
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/pages', async (_req, res) => {
  try {
    res.json(await listPageNames());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/pages/:name', async (req, res) => {
  try {
    const content = await fs.readFile(pagePath(req.params.name), 'utf8');
    res.json({ name: req.params.name, content });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

app.put('/api/pages/:name', async (req, res) => {
  try {
    const content = req.body.content;
    if (typeof content !== 'string') {
      return res.status(400).json({ error: 'content must be a string' });
    }
    await fs.writeFile(pagePath(req.params.name), content, 'utf8');
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/pages', async (req, res) => {
  try {
    const name = String(req.body.name || '').trim();
    if (!name) {
      return res.status(400).json({ error: 'name is required' });
    }

    const filePath = pagePath(name);
    try {
      await fs.access(filePath);
      return res.status(409).json({ error: `pages/${name}.html already exists` });
    } catch {
      // file does not exist — create it
    }

    const content = req.body.content || PAGE_TEMPLATE;
    await fs.writeFile(filePath, content, 'utf8');
    res.json({ ok: true, name });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/collections/:name/add-page', async (req, res) => {
  try {
    const pageName = String(req.body.page || '').trim();
    const item = req.body.item;
    if (!pageName || !item) {
      return res.status(400).json({ error: 'page and item are required' });
    }

    const items = await readCollection(req.params.name);
    items.push({
      name: item.name || pageName,
      url: `?page=${pageName}`,
      src: item.src || '',
      alt: item.alt || '',
      description: item.description || '',
    });

    const filePath = collectionPath(req.params.name);
    await fs.writeFile(filePath, `${JSON.stringify(items, null, 4)}\n`, 'utf8');
    res.json({ ok: true, items });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/validate', async (_req, res) => {
  try {
    res.json(await buildValidationReport());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/template/page', (_req, res) => {
  res.json({ content: PAGE_TEMPLATE });
});

app.listen(PORT, () => {
  console.log(`Portfolio admin: http://localhost:${PORT}`);
  console.log(`Site preview:    http://localhost:${SITE_PORT}`);
  console.log(`Editing files in: ${SITE_ROOT}`);
});