# Verification Redirect App

This app serves a Cloudflare Turnstile CAPTCHA verification page
before redirecting users to a destination URL.

## Environment Variables (DigitalOcean App Platform)

- DESTINATION_URL: Your final redirect URL
- TURNSTILE_SECRET_KEY: Cloudflare Turnstile secret key
- TURNSTILE_SITE_KEY: Cloudflare Turnstile site key

## Deployment

1. Push this repo to GitHub
2. Go to DigitalOcean → App Platform → Create App → Connect GitHub
3. Set Build Command: `npm install`
4. Set Run Command: `node server.js`
5. Add the 3 environment variables
6. Deploy
7. Open the random verification link in the console log
