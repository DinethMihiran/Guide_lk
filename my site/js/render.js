/**
 * render.js
 * ---------------------------------------------------------------
 * Shared, reusable functions that turn post/category DATA into
 * HTML strings. Both main.js (homepage) and post.js (article
 * page) use these, so the visual structure of a "post card" or
 * a "category tag" only needs to be defined once, here.
 * ---------------------------------------------------------------
 */

// Look up a category object by id. Falls back to a safe default
// so the site never breaks if a post references an unknown category.
function getCategory(categoryId) {
  return (
    categories.find((c) => c.id === categoryId) || {
      id: categoryId,
      name: categoryId,
      color: "#888888",
      icon: "📄",
    }
  );
}

// Format "2026-06-01" as "Jun 1, 2026"
function formatDate(isoDateString) {
  const date = new Date(isoDateString + "T00:00:00");
  if (isNaN(date)) return isoDateString;
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// Build the HTML for one post card (used in the homepage grid)
function renderPostCard(post) {
  const cat = getCategory(post.category);
  return `
    <a class="post-card" href="post.html?id=${encodeURIComponent(post.id)}" style="--cat-color:${cat.color}">
      <div class="post-card__image-wrap">
        <img class="post-card__image" src="${post.image}" alt="${escapeHtml(post.title)}" loading="lazy">
        <span class="post-card__tag">${cat.icon} ${escapeHtml(cat.name)}</span>
      </div>
      <div class="post-card__body">
        <h3 class="post-card__title">${escapeHtml(post.title)}</h3>
        <p class="post-card__desc">${escapeHtml(post.shortDescription || "Description coming soon.")}</p>
        <div class="post-card__meta">
          ${post.price ? `<span class="post-card__price">${escapeHtml(post.price)}</span>` : "<span></span>"}
          <span class="post-card__date">${formatDate(post.publicationDate)}</span>
        </div>
      </div>
    </a>
  `;
}

// Build the HTML for a whole grid of post cards
function renderPostGrid(postList) {
  if (!postList.length) {
    return `
      <div class="empty-state">
        <p class="empty-state__title">No posts found</p>
        <p class="empty-state__desc">Try a different search term or category.</p>
      </div>
    `;
  }
  return postList.map(renderPostCard).join("");
}

// Build the category pill navigation, marking `activeId` as selected
function renderCategoryNav(activeId) {
  const allPill = `
    <button class="category-pill ${!activeId ? "is-active" : ""}" data-category="">
      All
    </button>
  `;
  const pills = categories
    .map(
      (cat) => `
      <button class="category-pill ${activeId === cat.id ? "is-active" : ""}"
              data-category="${cat.id}"
              style="--cat-color:${cat.color}">
        ${cat.icon} ${escapeHtml(cat.name)}
      </button>
    `
    )
    .join("");
  return allPill + pills;
}

// Basic HTML-escaping so post data can never break page markup
function escapeHtml(str) {
  if (str === undefined || str === null) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Build a simple <dl>-style key/value block, used for
// specifications and nutrition info. Returns "" if data is empty.
function renderKeyValueBlock(title, dataObj) {
  if (!dataObj || Object.keys(dataObj).length === 0) return "";
  const rows = Object.entries(dataObj)
    .map(
      ([label, value]) => `
        <div class="kv-row">
          <span class="kv-row__label">${escapeHtml(label)}</span>
          <span class="kv-row__value">${escapeHtml(value)}</span>
        </div>`
    )
    .join("");
  return `
    <section class="post-block">
      <h2 class="post-block__title">${escapeHtml(title)}</h2>
      <div class="kv-block">${rows}</div>
    </section>
  `;
}

// Build a simple bullet list block. Returns "" if the list is empty.
function renderListBlock(title, items) {
  if (!items || items.length === 0) return "";
  const lis = items.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
  return `
    <section class="post-block">
      <h2 class="post-block__title">${escapeHtml(title)}</h2>
      <ul class="post-list">${lis}</ul>
    </section>
  `;
}

// Build a two-column pros/cons block. Returns "" if both are empty.
function renderProsConsBlock(pros, cons) {
  if ((!pros || !pros.length) && (!cons || !cons.length)) return "";
  const prosLis = (pros || []).map((p) => `<li>${escapeHtml(p)}</li>`).join("");
  const consLis = (cons || []).map((c) => `<li>${escapeHtml(c)}</li>`).join("");
  return `
    <section class="post-block">
      <h2 class="post-block__title">Pros &amp; Cons</h2>
      <div class="pros-cons">
        <div class="pros-cons__col pros-cons__col--pros">
          <h3>Pros</h3>
          <ul>${prosLis || "<li>—</li>"}</ul>
        </div>
        <div class="pros-cons__col pros-cons__col--cons">
          <h3>Cons</h3>
          <ul>${consLis || "<li>—</li>"}</ul>
        </div>
      </div>
    </section>
  `;
}
