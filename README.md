# 🌩️ Cloudflare R2 Image Uploader

A **serverless image upload platform** powered by **Cloudflare Workers** + **R2**, with a simple **frontend** to upload and retrieve images via a unique URL — all deployed on Cloudflare's global infrastructure.

---

## 🚀 Live Demo
- **Frontend (Choose File or Drag-and-drop)**: [https://cloudflare-r2-image-uploader.pages.dev/](https://cloudflare-r2-image-uploader.pages.dev/)
- **API (Upload + Fetch images)**: [https://dpp1.burrito-bot.workers.dev](https://dpp1.burrito-bot.workers.dev)

---

## ✨ Features

- ✅ Upload images directly to R2 (Cloudflare Object Storage).
- ✅ Retrieve and serve images via unique URL.
- ✅ Serverless & globally distributed — zero backend servers.
- ✅ Easy to extend and customize.

---

## 📂 Project Structure
```
dpp1/
├── backend/                # Cloudflare Worker + R2 backend (API)
│   ├── src/                # Worker source code (index.js)
│   ├── wrangler.jsonc      # Cloudflare Worker + R2 config
│   └── package.json        # (if any, for Worker dependencies)
└── frontend/               # Frontend for Cloudflare Pages
    └── index.html          # Upload form to call API
```
