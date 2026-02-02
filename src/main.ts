import { generators, getGeneratorById } from "./core/registry";
import { mountGeneratorUI } from "./ui";

const app = document.querySelector<HTMLDivElement>("#app");

if (app) {
  const baseUrl = import.meta.env.BASE_URL || "/";
  const params = new URLSearchParams(window.location.search);
  const selectedId = params.get("g");
  const selected = selectedId ? getGeneratorById(selectedId) : undefined;

  if (selected) {
    app.innerHTML = `
      <main style="max-width: 1100px; margin: 0 auto; padding: 40px 24px;">
        <header style="margin-bottom: 24px;">
          <a href="${baseUrl}" style="text-decoration:none; color: inherit;">← Back to gallery</a>
          <h1 style="margin: 12px 0 6px;">${selected.name}</h1>
          <p style="margin: 0; color: #555;">${selected.description ?? ""}</p>
        </header>
        <div id="generatorRoot"></div>
      </main>
    `;
    const root = app.querySelector<HTMLDivElement>("#generatorRoot");
    if (root) {
      mountGeneratorUI(root, selected);
    }
  } else {
    document.body.style.fontFamily = "system-ui";
    const cards = generators
      .map((generator) => {
        const description = generator.description
          ? `<p>${generator.description}</p>`
          : "";
        return `
          <article class="card">
            <h2>${generator.name}</h2>
            ${description}
            <a href="${baseUrl}?g=${generator.id}" class="card-link">Open ${generator.name}</a>
          </article>
        `;
      })
      .join("");

    app.innerHTML = `
      <main style="max-width: 900px; margin: 0 auto; padding: 48px 24px;">
        <header style="margin-bottom: 32px;">
          <h1 style="margin: 0 0 12px;">Plotter SVG Gallery</h1>
          <p style="margin: 0; color: #555;">Select a generator to explore its parameter controls and export tools.</p>
        </header>
        <section style="display:flex; flex-direction: column; gap: 16px;">
          ${cards}
        </section>
      </main>
    `;
  }
}
