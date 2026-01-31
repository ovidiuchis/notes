/**
 * Personal List - App Logic
 * Supabase-powered
 */

// Supabase client initialization
const db = window.supabase.createClient(
  CONFIG.supabase.url,
  CONFIG.supabase.publicKey,
);

const state = {
  data: null,
  search: "",
  route: { view: "home", id: null },
};

const $ = (s) => document.querySelector(s);

// Init
async function init() {
  try {
    // Fetch resources using RPC function
    const { data, error } = await db.rpc("get_resources_json");

    if (error) throw error;

    state.data = data;

    setupRouter();
    render();
  } catch (e) {
    console.error(e);
    $("#app").innerHTML =
      '<p style="color:#999; text-align:center">Eroare la încărcare.</p>';
  }
}

// Router
function setupRouter() {
  window.addEventListener("hashchange", handleRoute);
  handleRoute();
}

function handleRoute() {
  const hash = window.location.hash.slice(1);
  if (!hash || hash === "/") {
    state.route = { view: "home" };
  } else if (hash.startsWith("/page/")) {
    state.route = { view: "page", id: hash.split("/page/")[1] };
  } else if (hash.startsWith("/tool/")) {
    state.route = { view: "tool", id: hash.split("/tool/")[1] };
  } else {
    state.route = { view: "home" };
  }
  render();
  window.scrollTo(0, 0);
}

// Render
async function render() {
  const app = $("#app");
  const { view, id } = state.route;

  if (view === "home") {
    renderHome(app);
  } else if (view === "page") {
    await renderPage(app, id);
  } else if (view === "tool") {
    renderTool(app, id);
  }
}

function renderHome(container) {
  // Search logic
  const q = state.search.toLowerCase();
  const items = state.data.items.filter((i) => {
    if (!q) return true;
    return (
      i.title.toLowerCase().includes(q) ||
      (i.note && i.note.toLowerCase().includes(q))
    );
  });

  // Groups
  const sections = state.data.sections || [];
  let html = `
    <div class="search-container">
      <input type="text" class="search-input" placeholder="Caută..." 
             value="${state.search}" oninput="updateSearch(this.value)">
    </div>
  `;

  // Pinned Items (if any, and if no search, or if they match search)
  const pinned = items.filter((i) => i.pinned);
  if (pinned.length > 0 && !q) {
    // Only show pinned section specially if not searching? Or always? Let's just follow normal groups for simplicity unless specified. User asked for "Optional Pinned group".
    // Actually, let's just let pinned be a property. We can show them at top if we want, or just inside groups.
    // Prompt said: "Optional: Pinned group at the top". Let's do it.
    html += renderGroup({ label: "Pinned" }, pinned);
  }

  // Regular Sections
  sections.forEach((sec) => {
    const groupItems = items.filter(
      (i) => i.sectionId === sec.id && (!i.pinned || q),
    ); // If pinned, don't show in regular group to avoid dupe, unless searching
    if (groupItems.length > 0) {
      html += renderGroup(sec, groupItems);
    }
  });

  if (items.length === 0) {
    html += `<p style="color:#999; text-align:center; margin-top:2rem">Nimic găsit.</p>`;
  }

  container.innerHTML = html;

  // Refocus search if it was active
  const input = container.querySelector(".search-input");
  if (input) {
    input.focus();
    input.setSelectionRange(input.value.length, input.value.length);
  }
}

function renderGroup(section, items) {
  if (items.length === 0) return "";
  return `
    <div class="resource-group">
      <h3 class="group-title">${section.label}</h3>
      <ul class="resource-list">
        ${items
          .map((item) => {
            let href = item.url;
            let target = "_blank";
            let icon = "↗"; // External default

            if (item.type === "page") {
              href = `#/page/${item.id}`;
              target = "_self";
              icon = "⧉";
            } else if (item.type === "tool") {
              href = `#/tool/${item.id}`;
              target = "_self";
              icon = "⏱";
            }

            // Icon classes for different types
            let iconClass = "meta-icon meta-external";
            if (item.type === "page") {
              iconClass = "meta-icon meta-page";
            } else if (item.type === "tool") {
              iconClass = "meta-icon meta-tool";
            }

            return `
            <li>
              <a href="${href}" target="${target}" class="resource-item">
                <div class="item-row">
                  <span class="item-title">${item.title}</span>
                  <span class="item-meta">
                    <span class="${iconClass}" title="${item.type === "page" ? "Pagină internă" : item.type === "tool" ? "Instrument" : "Link extern"}">${icon}</span>
                  </span>
                </div>
                ${item.note ? `<span class="item-note">${item.note}</span>` : ""}
              </a>
            </li>
          `;
          })
          .join("")}
      </ul>
    </div>
  `;
}

async function renderPage(container, id) {
  try {
    // Fetch article using RPC function
    const { data, error } = await db.rpc("get_article_json", {
      article_slug: id,
    });

    if (error || !data) throw new Error("Not found");

    renderPageContent(container, data);
  } catch (e) {
    container.innerHTML = `<p>Nota nu a fost găsită.</p><a href="#/">Înapoi</a>`;
  }
}

function renderPageContent(container, note) {
  const blocks = note.contentBlocks || [];

  // Quick renderer for blocks
  const parseRichText = (text) => {
    if (!text) return "";
    return text
      .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>") // Bold
      .replace(/\*(.*?)\*/g, "<i>$1</i>") // Italic
      .replace(
        /==(\w+):(.*?)==/g,
        '<mark style="background-color:$1; color:inherit;">$2</mark>',
      ) // Highlight with color ==red:text==
      .replace(/==(.*?)==/g, "<mark>$1</mark>") // Highlight default ==text==
      .replace(
        /\[(.*?)\]\((.*?)\)/g,
        '<a href="$2" target="_blank" style="color:var(--link-color); text-decoration:underline;">$1</a>',
      ); // Link
  };

  const html = blocks
    .map((b) => {
      // Apply parsing to text fields
      const text = b.text ? parseRichText(b.text) : "";

      if (b.type === "h2" || b.type === "heading") return `<h2>${text}</h2>`;
      if (b.type === "p" || b.type === "paragraph") return `<p>${text}</p>`;
      if (b.type === "ul" || b.type === "list")
        return `<ul>${(b.items || []).map((li) => `<li>${parseRichText(li)}</li>`).join("")}</ul>`;
      if (b.type === "quote")
        return `<blockquote class="block-quote">${text}</blockquote>`;
      if (b.type === "scripture")
        return `<div class="block-scripture"><span class="scripture-text">${text}</span><span class="scripture-ref">${b.reference}</span></div>`;
      if (b.type === "callout")
        return `<div class="block-callout">${text}</div>`;
      if (b.type === "divider")
        return `<hr style="border:0; border-top:1px solid #eee; margin:2rem 0">`;
      return "";
    })
    .join("");

  container.innerHTML = `
    <div class="note-view">
      <div class="note-nav"><a href="#/">← Înapoi</a></div>
      <h1 class="note-title">${note.title}</h1>
      <div class="note-content">${html}</div>
    </div>
  `;
}

function renderTool(container, id) {
  const item = state.data.items.find((i) => i.id === id);
  const path = item ? item.toolPath : `tools/${id}/index.html`;

  container.innerHTML = `
    <div class="tool-view">
      <div class="app-host-header">
        <a href="#/" style="font-size:0.9rem; color:#999">← Înapoi</a>
        <span style="font-weight:600">${item ? item.title : "Tool"}</span>
      </div>
      <div class="app-host-container">
        <iframe src="${path}" class="app-frame"></iframe>
      </div>
    </div>
  `;
}

window.updateSearch = (val) => {
  state.search = val;
  renderHome($("#app"));
};

document.addEventListener("DOMContentLoaded", init);
