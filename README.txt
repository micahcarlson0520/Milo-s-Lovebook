Milo’s Lovebook — AI Ideas + PWA
================================

What this is
------------
A private little web app for Milo with:
- Journal, Health logs, Gallery, Backups
- **Ideas page with AI generator** (via Netlify Function + OpenAI API)
- Installable PWA icon for home screen

You’ll deploy this **for free** on Netlify’s starter plan, and add your own OpenAI API key as an environment variable (billed by OpenAI per usage).

Step-by-step deploy (no coding)
-------------------------------
1) Create an OpenAI API key
   - Sign in at https://platform.openai.com/
   - Go to "API keys" and click "Create new secret key"
   - Copy the key (it starts with `sk-...`) and keep it safe

2) Put these files in a new GitHub repo
   - Go to https://github.com → New → Repository → name it e.g. `milo-lovebook`
   - Click "Add file" → "Upload files"
   - Drag the **contents** of this folder (index.html, sw.js, manifest.webmanifest, icons/, netlify/, netlify.toml) into GitHub’s upload page
   - Commit the changes

3) Connect the repo to Netlify
   - In Netlify, click "Add new site" → "Import from Git"
   - Authorize GitHub if prompted, choose your `milo-lovebook` repo
   - Build settings: none required (it’s static); `netlify.toml` tells Netlify where the Functions live
   - Deploy → you’ll get a live URL like `https://something.netlify.app`

4) Add your OpenAI key on Netlify (so the AI button works)
   - Site settings → Environment variables → "Add a variable"
   - Name: `OPENAI_API_KEY`
   - Value: paste your key
   - Save → Back to Deploys → "Trigger deploy" → "Clear cache and deploy site"

5) Test the Ideas generator
   - Open your live URL → go to Ideas tab
   - Type a prompt (e.g., "rainy day enrichment") → press **Generate**
   - You should see 3–5 idea cards; each can be added to Health To-Dos

Notes
-----
- PWA icon changes may require re-install to update on iOS.
- All personal data stays in the browser (localStorage). Use the Backup tab to export/import.
- To update the site, edit files in GitHub and commit; Netlify redeploys automatically.

Enjoy!