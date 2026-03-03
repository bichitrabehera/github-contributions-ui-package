# github-contributions-ui

Display a **GitHub-style contributions graph** anywhere in your React or Next.js application.

A lightweight, plug-and-play component designed for developer portfolios, dashboards, and personal websites.

---

## ✨ Features

* GitHub-style contribution heatmap
* Plug-and-play setup
* Works with **React** and **Next.js**
* No API keys required
* Lightweight and fast
* Theme support
* Fully client-side

---

## 📦 Installation

```bash
npm install github-contributions-ui
```

---

## 🚀 Quick Start

### Next.js (App Router)

```tsx
"use client";

import { GithubActivity } from "github-contributions-ui";

export default function Page() {
  return <GithubActivity username="octocat" theme="blue" />;
}
```

---

### React (Vite / CRA)

```tsx
import { GithubActivity } from "github-contributions-ui";

function App() {
  return <GithubActivity username="octocat" theme="blue" />;
}

export default App;
```

---

## ⚙️ Props

| Prop       | Type                                      | Required | Description                 |
| ---------- | ----------------------------------------- | -------- | --------------------------- |
| `username` | string                                    | ✅        | GitHub username             |
| `theme`    | `"light" \| "dark" \| "blue" \| "purple"` | ❌        | UI theme (default: `light`) |

### Example

```tsx
<GithubActivity
  username="octocat"
  theme="dark"
/>
```

---

## 🎨 Available Themes

* `light`
* `dark`
* `blue`
* `purple`

---

## 🌐 Live Demo

Try it instantly:

👉 https://github-contributions-ui.vercel.app/

---

## 💡 Use Cases

* Developer portfolios
* Personal websites
* SaaS dashboards
* Resume websites
* Developer profiles

---

## 🧱 Built With

* React
* TypeScript
* Next.js
* Tailwind CSS

## ☕ Support

<a href="https://buymeacoffee.com/bichitrabehera" target="_blank">
  <img src="https://img.buymeacoffee.com/button-api/?text=Buy%20me%20a%20coffee&emoji=☕&slug=your-username&button_colour=FFDD00&font_colour=000000&font_family=Cookie&outline_colour=000000&coffee_colour=ffffff" />
</a>