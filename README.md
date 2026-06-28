# CSSpeek

> Inspect, explore, and save CSS from any HTML — paste code or enter a URL.

![CSSpeek Screenshot](https://via.placeholder.com/900x480/0f1117/5b8af5?text=CSSpeek+Screenshot)

CSSpeek is an open-source developer tool that lets you drop in any HTML snippet (or a live URL) and instantly explore all CSS applied to each element — then save anything useful as a reusable snippet.

---

## Features

- **Dual input** — paste raw HTML/CSS or fetch a live URL
- **Element explorer** — walks the full DOM tree and lists every styled element
- **Property inspector** — click any declaration to copy it instantly
- **Snippet library** — save selectors with tags, search and filter them, copy as CSS blocks
- **Dark theme** — easy on the eyes for long sessions
- **Zero backend** — runs entirely in the browser; snippets stored in `localStorage`

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- npm or yarn

### Installation

```bash
git clone https://github.com/YOUR_USERNAME/csspeek.git
cd csspeek
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

### Build for production

```bash
npm run build
npm run preview
```

---

## Usage

1. **Paste HTML** — drop any HTML into the left panel, including `<style>` blocks or inline styles
2. **Or enter a URL** — CSSpeek will attempt to fetch the page via a CORS proxy
3. **Hit Analyze CSS** — all styled elements appear in the Inspector
4. **Click an element** — see every CSS property; click any row to copy it
5. **Save as snippet** — name it, add tags, find it later in the Snippets tab

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | React 18 |
| Language | TypeScript 5 |
| Build tool | Vite 5 |
| Icons | lucide-react |
| Styles | Plain CSS (design tokens) |
| Storage | localStorage |

---

## Roadmap

- [ ] CSS specificity visualizer
- [ ] Export snippets as a `.css` file
- [ ] Browser extension for inspecting live pages in-tab
- [ ] Color preview swatches inline with `color` / `background` values
- [ ] Computed style diff between two elements
- [ ] Import/export snippet library as JSON
- [ ] Snippet sharing via URL hash

---

## Contributing

Contributions are very welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for how to get started.

Found a bug? Open an [issue](https://github.com/YOUR_USERNAME/csspeek/issues).  
Have a feature idea? Start a [discussion](https://github.com/YOUR_USERNAME/csspeek/discussions).

---

## License

[MIT](LICENSE) © Anshuman Bahekar
