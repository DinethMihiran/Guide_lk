/**
 * main.js
 * ---------------------------------------------------------------
 * Homepage behavior only. Reads posts/categories from data.js,
 * uses render.js to turn them into HTML, and search.js to filter
 * them. Keeps two pieces of state: the current search text and
 * the current category filter, both reflected in the URL so
 * results are shareable/bookmarkable (e.g. index.html?category=foods).
 * ---------------------------------------------------------------
 */

const postGridEl = document.getElementById("post-grid");
const categoryNavEl = document.getElementById("category-nav");
const searchFormEl = document.getElementById("search-form");
const searchInputEl = document.getElementById("search-input");
const resultsCountEl = document.getElementById("results-count");
const activeFilterLabelEl = document.getElementById("active-filter-label");
const siteNavEl = document.querySelector(".site-nav");

// ---- read initial state from the URL (?q=...&category=...) ----
const initialParams = new URLSearchParams(window.location.search);
let state = {
  query: initialParams.get("q") || "",
  category: initialParams.get("category") || "",
};

async function init() {
  // Content now lives in /data/*.json instead of being baked into
  // this file, so we wait for it to load before rendering anything.
  try {
    await loadData();
  } catch (err) {
    postGridEl.innerHTML = `<div class="empty-state"><p class="empty-state__title">Couldn't load content</p><p class="empty-state__desc">${err.message}</p></div>`;
    return;
  }

  searchInputEl.value = state.query;
  renderCategoryLinksInNav();
  renderCategoryPills();
  renderResults();

  searchFormEl.addEventListener("submit", (e) => {
    e.preventDefault();
    state.query = searchInputEl.value;
    syncUrl();
    renderResults();
  });

  categoryNavEl.addEventListener("click", (e) => {
    const btn = e.target.closest(".category-pill");
    if (!btn) return;
    state.category = btn.dataset.category;
    syncUrl();
    renderCategoryPills();
    renderResults();
  });
}

// Adds one link per category to the top nav bar (after "Home"),
// so new categories in data.js show up automatically.
function renderCategoryLinksInNav() {
  const links = categories
    .map(
      (cat) =>
        `<a href="index.html?category=${encodeURIComponent(cat.id)}">${cat.icon} ${cat.name}</a>`
    )
    .join("");
  siteNavEl.insertAdjacentHTML("beforeend", links);
}

function renderCategoryPills() {
  categoryNavEl.innerHTML = renderCategoryNav(state.category);
}

function renderResults() {
  let results = posts;
  results = filterByCategory(results, state.category);
  results = searchPosts(results, state.query);

  // sort newest first
  results = [...results].sort(
    (a, b) => new Date(b.publicationDate) - new Date(a.publicationDate)
  );

  postGridEl.innerHTML = renderPostGrid(results);

  resultsCountEl.textContent = `${results.length} post${results.length === 1 ? "" : "s"}`;
  const catObj = state.category ? getCategory(state.category) : null;
  activeFilterLabelEl.textContent = [
    catObj ? `in ${catObj.name}` : "",
    state.query ? `matching “${state.query}”` : "",
  ]
    .filter(Boolean)
    .join(" · ");
}

function syncUrl() {
  const params = new URLSearchParams();
  if (state.query) params.set("q", state.query);
  if (state.category) params.set("category", state.category);
  const newUrl = `${window.location.pathname}${params.toString() ? "?" + params.toString() : ""}`;
  window.history.replaceState({}, "", newUrl);
}

init();
