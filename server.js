const express = require("express");
const fetch = require("node-fetch");
const path = require("path");
const bodyParser = require("body-parser");
const fs = require("fs");

const app = express();

// ============================
// CONFIGURATION
// ============================
const DESTINATION_URL = process.env.DESTINATION_URL;      // your redirect URL
const SECRET_KEY = process.env.TURNSTILE_SECRET_KEY;     // Cloudflare Turnstile secret key
const SITE_KEY = process.env.TURNSTILE_SITE_KEY;         // Cloudflare Turnstile site key
const RANDOM_PATH = Math.random().toString(36).substring(2, 8);
console.log("Your verification link:", `https://YOUR-APP-URL/${RANDOM_PATH}`);

// ============================
// MIDDLEWARE
// ============================
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname));

// ============================
// ROUTES
// ============================

// Serve verification page
app.get(`/${RANDOM_PATH}`, (req, res) => {
    let html = fs.readFileSync(path.join(__dirname, "verify.html"), "utf8");
    html = html.replace("YOUR_SITE_KEY_HERE", SITE_KEY);
    res.send(html);
});

// Verify Cloudflare Turnstile
app.post("/verify", async (req, res) => {
    const token = req.body["cf-turnstile-response"];
    const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

    try {
        const result = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ secret: SECRET_KEY, response: token, remoteip: ip })
        }).then(r => r.json());

        if (result.success) {
            return res.redirect("/go");
        } else {
            return res.send("CAPTCHA failed. Please go back and try again.");
        }
    } catch (err) {
        console.error(err);
        return res.send("Error verifying CAPTCHA.");
    }
});

// Final redirect
app.get("/go", (req, res) => {
    res.redirect(DESTINATION_URL);
});

// ============================
// START SERVER
// ============================
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log("Server running on port", PORT));
