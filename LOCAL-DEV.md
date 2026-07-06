# Local Development Setup

## Site preview

```bash
cd /Users/garydavis/Sites/gmdavisux.github.io
bash serve.sh
```

Open **http://localhost:4000**

Uses Python's built-in HTTP server. No Ruby, no Jekyll, no bundle.

---

## Admin dashboard (local only)

Edit collections (`js/*.json`) and pages (`pages/*.html`) in a browser UI.

```bash
# Terminal 1 — site preview
bash serve.sh

# Terminal 2 — admin
cd tools/admin
npm install   # first time only
npm run admin
```

Open **http://localhost:4001**

The admin writes directly to repo files. Commit when you are ready to publish.

---

## Troubleshooting

| Problem | Fix |
|---|---|
| Port already in use | `lsof -i :4000` then `kill <PID>`, or `bash serve.sh 4001` |
| Admin preview blank | Make sure the site server is running on port 4000 |
| `npm: command not found` | Install Node.js from https://nodejs.org |