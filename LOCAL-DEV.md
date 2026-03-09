# Local Development Setup

## Starting the Jekyll Server

### Option A — Run the start script
```bash
bash start_services.sh
```

### Option B — Run manually
```bash
cd /Users/garydavis/Sites/gmdavisux.github.io
bundle exec jekyll serve --config _config.yml,_config_dev.yml
```

Then open **http://localhost:4000** in your browser.

---

## Why two config files?

`_config.yml` sets `url: "https://usersimple.com"` for production.  
`_config_dev.yml` overrides it to `url: "http://localhost:4000"` for local use.

> **Note:** The `<base href>` in `index.html` now uses `{{site.baseurl}}/` only
> (renders as `/`), so CORS errors no longer occur regardless of which config is used.
> The dev config is still useful if you need `site.url` to resolve correctly in templates.

---

## Troubleshooting

| Problem | Fix |
|---|---|
| `command not found: jekyll` | Check `.ruby-version` matches an installed Ruby (`ruby --version`). Currently set to `3.3.1`. |
| CORS errors in browser console | Make sure you used `--config _config.yml,_config_dev.yml` |
| Port already in use | Run `lsof -i :4000` to find the process, then `kill <PID>` |
| Stale build artifacts | Run `bundle exec jekyll clean` then start again |
