# Web.Cafe — café web-design portfolio

A static portfolio and checkout site for a café-focused web design service. Plain HTML,
CSS and vanilla JavaScript — no build step and no framework.

## Files

```
index.html       Main portfolio: services, pricing, contact, policies
pay.html         Checkout page for the Deposit / Finished Product plans
portfolio.html`  Legacy draft — not linked from the current site
styles.css       Legacy stylesheet (current pages are self-contained)
script.js        Legacy script (current pages are self-contained)
robots.txt       Crawler rules, including checkout exclusion
_headers         Security headers for Netlify / Cloudflare Pages
vercel.json      Security headers for Vercel
.htaccess        HTTPS redirect, security headers and copier blocking for Apache
COPYRIGHT.txt    Copyright / no-mirroring notice
.gitignore       Keeps secrets and key files out of version control
README.md
```

## Local preview

Use any static server, for example:

```powershell
python -m http.server 8000
```

Then open <http://localhost:8000/>. Direct `file://` opening works too, but the clipboard
API and some browser security features behave differently.

## Pricing and checkout

- Deposit: **15,000 AMD**
- Finished Product: **30,000 AMD**

Pricing buttons link to `pay.html?plan=deposit` and `pay.html?plan=finished`.
Payment details are configured in `pay.html` in the `PLANS` object (`providerUrl`,
`bank.*`, `idram`). Until `providerUrl` is set, the Card / Idram button stays disabled and
the page offers email and bank transfer instead.

**Do not put secret API keys in `pay.html` or any other static file.** Everything in a
static site is public. A payment provider's public checkout URL is fine; a secret key or
webhook secret must live on a server, never in the browser.

## Security and HTTPS

**No API keys or secrets were found in this project.** The only third-party requests are
Google Fonts.

**HTTPS** is provided by the host; a static folder cannot serve HTTPS by itself. Use a host
with automatic TLS and enable its HTTP→HTTPS redirect:

- `_headers` — Netlify and Cloudflare Pages (includes HSTS).
- `vercel.json` — Vercel (automatic HTTPS/redirect).
- `.htaccess` — Apache: forces HTTPS, sets headers, disables directory listing and blocks
  known offline-copy tools.
- **GitHub Pages** ignores `.htaccess` and custom headers; enable “Enforce HTTPS” in the
  repository settings. The CSP meta tags in the HTML still apply.

The pages also contain a Content-Security-Policy (CSP) and referrer policy as a fallback.
The policy allows only this origin, Google Fonts, and `mailto:` links.

## Copying, HTTrack and “impossible to copy”

A public website cannot be made impossible to copy. The browser must receive the HTML, CSS,
JavaScript and images to display the page, so anything a visitor can see can be saved, and
HTTrack can spoof its User-Agent to look like a normal browser. This project uses layered
deterrence:

1. `.htaccess` returns **403** for default copier User-Agents (HTTrack, WebCopier,
   Teleport, SiteSnagger, Offline Explorer, Wget, curl, etc.).
2. `robots.txt` asks those tools not to crawl (advisory only).
3. `X-Robots-Tag: noarchive` discourages cached copies.
4. `COPYRIGHT.txt` and the footer state that mirroring is not permitted.
5. CSP `frame-ancestors 'none'` / `X-Frame-Options: DENY` block embedding on other sites.

For real protection, use infrastructure controls:

- **Cloudflare:** enable Always Use HTTPS + HSTS, add a WAF rule matching copier
  User-Agents, and use Cloudflare Access if the site must be private.
- **Netlify / Vercel:** add an edge function or middleware that returns 403 for those
  User-Agents before serving the page.
- **Apache/cPanel:** the included `.htaccess` handles it.

Disabling right-click or text selection would not stop HTTrack and would hurt accessibility,
so it is intentionally not used. If the goal is protecting the design from a client or
competitor, a written contract plus a visible copyright notice is more effective than
client-side tricks.
