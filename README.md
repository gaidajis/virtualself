# VirtualSelf

> A personal AI-powered virtual identity and self-representation web application.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-blue?logo=github)](https://gaidajis.github.io/virtualself/)
[![License: CC BY-NC 4.0](https://img.shields.io/badge/License-CC%20BY--NC%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by-nc/4.0/)
[![React](https://img.shields.io/badge/React-19-61dafb?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178c6?logo=typescript)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-7.2-646cff?logo=vite)](https://vite.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4-06b6d4?logo=tailwindcss)](https://tailwindcss.com)

---

## 🌐 Live Demo

**[https://gaidajis.github.io/virtualself/](https://gaidajis.github.io/virtualself/)**

---

## Overview

**VirtualSelf** is a modern, fully client-side React web application that provides a rich, interactive platform for building and showcasing a personal virtual identity. It combines a comprehensive UI component library with state-of-the-art tooling to deliver a smooth, accessible, and visually polished experience.

Built with React 19, TypeScript 5.9, Vite 7, and Tailwind CSS — the application is deployed as a static site on GitHub Pages and requires no backend infrastructure.

---

## ✨ Features

- **50+ pre-built UI components** powered by shadcn/ui and Radix UI primitives
- **Dark/Light theme switching** via `next-themes`
- **Smooth animations** with Framer Motion
- **Charts and data visualization** via Recharts
- **Form management** with React Hook Form + Zod validation
- **Global state management** with Zustand + Immer
- **Fully accessible** — keyboard navigable, ARIA-compliant components
- **Responsive design** — mobile-first, Tailwind CSS utility classes
- **Type-safe** throughout — strict TypeScript configuration
- **Zero backend** — fully static, deployable to any CDN or static host

---

## 🛠 Tech Stack

| Category | Technology | Version |
|---|---|---|
| Framework | React | 19.x |
| Language | TypeScript | ~5.9 |
| Build Tool | Vite | 7.x |
| Styling | Tailwind CSS | 3.4 |
| Component Primitives | Radix UI | various |
| Animation | Framer Motion | 12.x |
| State Management | Zustand + Immer | 5.x / 11.x |
| Forms | React Hook Form + Zod | 7.x / 4.x |
| Charts | Recharts | 2.x |
| Deployment | GitHub Pages (GitHub Actions) | — |

---

## 📁 Project Structure

```
virtualself/
├── .github/
│   └── workflows/
│       └── deploy.yml        # GitHub Actions CI/CD → GitHub Pages
├── public/                   # Static assets (favicon, images)
├── src/
│   ├── components/
│   │   └── ui/               # 50+ shadcn/ui components
│   ├── sections/             # Page-level section components
│   ├── hooks/                # Custom React hooks
│   ├── types/                # TypeScript type definitions
│   ├── App.tsx               # Root component
│   ├── App.css               # App-level styles
│   ├── main.tsx              # Application entry point
│   └── index.css             # Global styles
├── index.html                # HTML entry point
├── vite.config.ts            # Vite configuration (base: /virtualself/)
├── tailwind.config.js        # Tailwind theme & plugin configuration
├── tsconfig.json             # TypeScript project references
├── tsconfig.app.json         # App TypeScript config
└── postcss.config.js         # PostCSS configuration
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) **v20 or higher**
- [npm](https://www.npmjs.com/) v10+

### Installation

```bash
# Clone the repository
git clone https://github.com/gaidajis/virtualself.git
cd virtualself

# Install dependencies
npm install
```

### Development

```bash
# Start the local dev server with hot module replacement
npm run dev
```

The app will be available at `http://localhost:5173`.

### Build for Production

```bash
# Type-check and compile to /dist
npm run build

# Preview the production build locally
npm run preview
```

### Linting

```bash
npm run lint
```

---

## 🧩 UI Components

The application includes 50+ accessible, composable UI components. All components are located in `src/components/ui/` and follow the [shadcn/ui](https://ui.shadcn.com/) convention — copy-owned, not a dependency.

<details>
<summary>View all components</summary>

`accordion` · `alert` · `alert-dialog` · `aspect-ratio` · `avatar` · `badge` · `breadcrumb` · `button` · `button-group` · `calendar` · `card` · `carousel` · `chart` · `checkbox` · `collapsible` · `command` · `context-menu` · `dialog` · `drawer` · `dropdown-menu` · `empty` · `field` · `form` · `hover-card` · `input` · `input-group` · `input-otp` · `item` · `kbd` · `label` · `menubar` · `navigation-menu` · `pagination` · `popover` · `progress` · `radio-group` · `resizable` · `scroll-area` · `select` · `separator` · `sheet` · `sidebar` · `skeleton` · `slider` · `sonner` · `spinner` · `switch` · `table` · `tabs` · `textarea` · `toggle` · `toggle-group` · `tooltip`

</details>

**Example usage:**

```tsx
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

export function MySection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Hello, VirtualSelf</CardTitle>
      </CardHeader>
      <CardContent>
        <Button variant="default">Get Started</Button>
      </CardContent>
    </Card>
  )
}
```

---

## 🚢 Deployment

This project is automatically deployed to **GitHub Pages** on every push to `main` via GitHub Actions (`.github/workflows/deploy.yml`).

The workflow:
1. Checks out the code
2. Installs dependencies with `npm ci`
3. Runs `npm run build` (TypeScript compile + Vite bundle)
4. Uploads the `dist/` folder as a Pages artifact
5. Deploys to `https://gaidajis.github.io/virtualself/`

To deploy manually, trigger the workflow from the **Actions** tab in GitHub.

---

## ⚖️ License

Copyright © 2025 Kyparissis Gkaintatzis. All rights reserved.

This project is licensed under the **Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)** license.

> **You are free to:**
> - Share — copy and redistribute the material in any medium or format
> - Adapt — remix, transform, and build upon the material
>
> **Under the following terms:**
> - **Attribution** — You must give appropriate credit, provide a link to the license, and indicate if changes were made.
> - **NonCommercial** — You may **not** use the material for commercial purposes.
>
> ⚠️ **Commercial use of this project — including but not limited to selling, licensing, white-labeling, incorporating into paid products or SaaS platforms, or using it within a commercial organization's internal or external tooling — is strictly prohibited without prior written permission from the author.**

For commercial licensing inquiries, please contact the author via [GitHub](https://github.com/gaidajis).

Full license text: [https://creativecommons.org/licenses/by-nc/4.0/legalcode](https://creativecommons.org/licenses/by-nc/4.0/legalcode)

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/gaidajis">gaidajis</a>
</p>
