# Akila Ranasinghe — Portfolio

Personal portfolio built with React + Vite, deployed to GitHub Pages.

## Getting Started

```bash
npm install
npm run dev
```

---

## Deploy to GitHub Pages

### 1. Create your GitHub repo

Create a new repo at github.com (e.g. `akila-portfolio`)

### 2. Update config with your repo name

**vite.config.js**
```js
base: '/your-repo-name/',
```

**package.json**
```json
"homepage": "https://YOUR_USERNAME.github.io/your-repo-name"
```

### 3. Push your code

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/your-repo-name.git
git push -u origin main
```

### 4. Deploy

```bash
npm run deploy
```

### 5. Enable GitHub Pages

Go to repo → Settings → Pages → Source: **gh-pages branch**

Your site will be live at `https://YOUR_USERNAME.github.io/your-repo-name`

---

## Updating Content

All content lives in **`src/data/portfolio.js`** — edit projects, experience, and skills there. Then run `npm run deploy` to push updates.

## Project Structure

```
src/
├── components/       One .jsx + .module.css per section
├── data/
│   └── portfolio.js  ← Edit your content here
├── App.jsx
└── index.css         Global CSS variables & fonts
```
