# 🚀 Portfolio Website

A modern, dark-mode portfolio built with **React + Vite**, **Tailwind CSS**, and **Framer Motion** — designed for AI Automation engineers and Web Developers.

---

## ✨ Features

- ⚡ React 18 + Vite — lightning-fast HMR
- 🎨 Tailwind CSS — utility-first styling
- 🎞 Framer Motion — smooth animations
- 🌙 Dark / Light mode toggle (persisted)
- 📊 Scroll progress bar
- ⬆️ Scroll-to-top button
- 🔍 Project search + category filter
- 📋 Project detail modal
- ⏱ Loading screen
- 📱 Fully responsive (mobile-first)
- 🔍 SEO meta tags + Open Graph
- 🤖 robots.txt + sitemap.xml

---

## 📁 Folder Structure

```
portfolio/
├── public/
│   ├── favicon.svg
│   ├── og-image.png          ← Add your OG image here
│   ├── resume.pdf            ← Add your resume here
│   ├── robots.txt
│   ├── sitemap.xml
│   └── projects/             ← Project images go here
│       ├── ai-sales-agent.png
│       └── ...
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Hero.jsx
│   │   ├── About.jsx
│   │   ├── Projects.jsx
│   │   ├── ProjectCard.jsx   ← Card + Modal
│   │   ├── Skills.jsx
│   │   ├── Experience.jsx
│   │   ├── Certificates.jsx
│   │   ├── Contact.jsx
│   │   ├── Footer.jsx
│   │   └── LoadingScreen.jsx
│   ├── data/
│   │   ├── projects.js       ← ⭐ ADD PROJECTS HERE
│   │   └── profile.js        ← ⭐ EDIT YOUR INFO HERE
│   ├── hooks/
│   │   └── index.js
│   ├── utils/
│   │   └── animations.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.js
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# 1. Navigate to the project
cd portfolio

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev

# 4. Open in browser
# http://localhost:5173
```

### Build for production

```bash
npm run build
npm run preview   # preview the build locally
```

---

## ✏️ Personalizing Your Portfolio

### 1. Update your personal info
Edit **`src/data/profile.js`**:

```js
export const personalInfo = {
  name: "Your Real Name",
  email: "you@example.com",
  github: "https://github.com/yourusername",
  linkedin: "https://linkedin.com/in/yourusername",
  whatsapp: "https://wa.me/YOUR_PHONE",
  resumeUrl: "/resume.pdf",
  // ... etc
};
```

### 2. Add a project (only 1 file to edit!)
Add a new object to the `projects` array in **`src/data/projects.js`**:

```js
{
  id: "my-new-project",           // unique id
  title: "My New Project",
  category: "AI Agent",           // "AI Agent" | "AI Automation" | "Web Development" | "Other"
  description: "One-liner shown on card",
  longDesc: "Longer paragraph for the modal",
  image: "/projects/my-project.png",  // place image in public/projects/
  tech: ["Python", "OpenAI", "FastAPI"],
  features: [
    "Feature one",
    "Feature two",
  ],
  github: "https://github.com/you/repo",
  live: "https://demo.com",
  featured: true,  // shows a ⭐ Featured badge
}
```

That's it! The project will automatically appear in the grid and be searchable.

### 3. Add project images
Place images in **`public/projects/`** and reference them as `/projects/filename.png`.

### 4. Add your resume
Drop your PDF at **`public/resume.pdf`**.

### 5. Set up contact form
The form uses [Formspree](https://formspree.io/) (free tier = 50 submissions/month).

1. Create a free account at formspree.io
2. Create a new form and copy your Form ID
3. In `Contact.jsx`, replace `YOUR_FORM_ID`:
   ```js
   const res = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
   ```

---

## 🚀 Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow the prompts — Vercel auto-detects Vite
```

Or push to GitHub and connect the repo in the [Vercel dashboard](https://vercel.com/dashboard).

---

## 🚀 Deploy to GitHub Pages

1. Install the gh-pages plugin:
   ```bash
   npm install --save-dev gh-pages
   ```

2. Update `vite.config.js`:
   ```js
   export default defineConfig({
     plugins: [react()],
     base: '/your-repo-name/',  // ← your GitHub repo name
   })
   ```

3. Add to `package.json`:
   ```json
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   }
   ```

4. Deploy:
   ```bash
   npm run deploy
   ```

---

## 🎨 Customizing Colors

In `tailwind.config.js`, update the brand colors:

```js
colors: {
  brand: {
    blue: '#3B82F6',    // ← change these
    purple: '#8B5CF6',
    cyan: '#06B6D4',
  },
},
```

Then update the gradient references in `src/index.css`.

---

## 📱 Sections

| Section | File | Data Source |
|---------|------|------------|
| Hero | `Hero.jsx` | `profile.js → personalInfo` |
| About | `About.jsx` | `profile.js → personalInfo` |
| Projects | `Projects.jsx` | `projects.js → projects` |
| Skills | `Skills.jsx` | `profile.js → skillGroups` |
| Experience | `Experience.jsx` | `profile.js → experiences` |
| Certificates | `Certificates.jsx` | `profile.js → certificates` |
| Contact | `Contact.jsx` | `profile.js → personalInfo` |

---

## 🛠 Tech Stack

- [React 18](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS v3](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Lucide React](https://lucide.dev/)
- [Formspree](https://formspree.io/) (contact form)

---

## 📄 License

MIT — free to use for personal and commercial portfolios.
