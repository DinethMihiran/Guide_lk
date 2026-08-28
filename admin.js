/**
 * admin.js
 * ---------------------------------------------------------------
 * All the behavior for admin.html. This is the ONLY file you'd
 * touch if you wanted to change how the content-editing FORM
 * looks or behaves — it never touches the public site's HTML/CSS/
 * render.js/search.js, and the public site never touches this
 * file. The two are wired together only through data-store.js.
 * ---------------------------------------------------------------
 */

const listEl = document.getElementById("admin-list");
const mainEl = document.getElementById("admin-main");
const newItemBtn = document.getElementById("new-item-btn");
const tabButtons = document.querySelectorAll(".admin-tab");

let currentTab = "posts"; // "posts" | "categories"
let selectedId = null; // null = "creating a new item"

async function init() {
  try {
    await loadData();
  } catch (err) {
    mainEl.innerHTML = `<div class="admin-empty-form">Couldn't load content: ${err.message}</div>`;
    return;
  }

  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      currentTab = btn.dataset.tab;
      selectedId = null;
      tabButtons.forEach((b) => b.classList.toggle("is-active", b === btn));
      newItemBtn.textContent = currentTab === "posts" ? "+ New Post" : "+ New Category";
      renderList();
      renderForm();
    });
  });

  newItemBtn.addEventListener("click", () => {
    selectedId = null;
    renderList();
    renderForm();
  });

  document.getElementById("export-posts-link").addEventListener("click", (e) => {
    e.preventDefault();
    downloadJson("posts.json", posts);
    showToast("posts.json downloaded — replace /data/posts.json with it.");
  });

  document.getElementById("export-categories-link").addEventListener("click", (e) => {
    e.preventDefault();
    downloadJson("categories.json", categories);
    showToast("categories.json downloaded — replace /data/categories.json with it.");
  });

  document.getElementById("discard-edits-link").addEventListener("click", async (e) => {
    e.preventDefault();
    if (!hasLocalEdits()) {
      showToast("No local edits to discard.");
      return;
    }
    if (!confirm("Discard all local edits and reload the original /data files?")) return;
    discardLocalEdits();
    await loadData();
    selectedId = null;
    renderList();
    renderForm();
    showToast("Local edits discarded.");
  });

  renderList();
  renderForm();
}

// ---------------------------------------------------------------
// LIST (sidebar)
// ---------------------------------------------------------------
function renderList() {
  const items = currentTab === "posts" ? posts : categories;

  if (!items.length) {
    listEl.innerHTML = `<p class="admin-empty-list">Nothing here yet — use the button above to add one.</p>`;
    return;
  }

  listEl.innerHTML = items
    .map((item) => {
      const isPost = currentTab === "posts";
      const color = isPost ? getCategory(item.category).color : item.color;
      const metaText = isPost ? formatDate(item.publicationDate) : `${countPostsInCategory(item.id)} posts`;
      return `
        <button class="admin-list-item ${item.id === selectedId ? "is-selected" : ""}"
                style="--item-color:${color || "#ccc"}"
                data-id="${item.id}">
          <span class="admin-list-item__title">${escapeHtml(item.title || item.name)}</span>
          <span class="admin-list-item__meta">${metaText}</span>
        </button>
      `;
    })
    .join("");

  listEl.querySelectorAll(".admin-list-item").forEach((btn) => {
    btn.addEventListener("click", () => {
      selectedId = btn.dataset.id;
      renderList();
      renderForm();
    });
  });
}

function countPostsInCategory(categoryId) {
  return posts.filter((p) => p.category === categoryId).length;
}

// ---------------------------------------------------------------
// FORM (main pane)
// ---------------------------------------------------------------
function renderForm() {
  if (currentTab === "posts") {
    renderPostForm();
  } else {
    renderCategoryForm();
  }
}

function renderPostForm() {
  const editing = selectedId ? posts.find((p) => p.id === selectedId) : null;
  const p = editing || {
    id: "",
    title: "",
    category: categories[0] ? categories[0].id : "",
    image: "",
    shortDescription: "",
    content: [],
    tags: [],
    affiliateUrl: "",
    price: "",
    publicationDate: new Date().toISOString().slice(0, 10),
    specifications: {},
    nutrition: {},
    ingredients: [],
    benefits: [],
    considerations: [],
    pros: [],
    cons: [],
  };

  const categoryOptions = categories
    .map((c) => `<option value="${c.id}" ${c.id === p.category ? "selected" : ""}>${c.icon} ${escapeHtml(c.name)}</option>`)
    .join("");

  mainEl.innerHTML = `
    <h2>${editing ? "Edit post" : "New post"}</h2>
    <p class="admin-main__subtitle">${editing ? `Editing “${escapeHtml(editing.title)}”` : "Fill in the fields below to publish a new post."}</p>

    <form id="post-form">
      <div class="admin-form-row admin-form-row--split">
        <div>
          <label for="f-title">Title</label>
          <input type="text" id="f-title" required value="${escapeAttr(p.title)}">
        </div>
        <div>
          <label for="f-category">Category</label>
          <select id="f-category">${categoryOptions}</select>
        </div>
      </div>

      <div class="admin-form-row">
        <label for="f-id">URL id <span class="field-hint">Auto-filled from the title. Change with care — editing it after publishing breaks old links.</span></label>
        <input type="text" id="f-id" required value="${escapeAttr(p.id)}" ${editing ? "" : "placeholder=\"auto-generated-from-title\""}>
      </div>

      <div class="admin-form-row">
        <label for="f-short">Short description <span class="field-hint">Shown on cards, 1–2 sentences.</span></label>
        <textarea id="f-short" rows="2">${escapeHtml(p.shortDescription)}</textarea>
      </div>

      <div class="admin-form-row">
        <label for="f-content">Full article content <span class="field-hint">One paragraph per line.</span></label>
        <textarea id="f-content" rows="6">${escapeHtml((p.content || []).join("\n"))}</textarea>
      </div>

      <div class="admin-form-row admin-form-row--split">
        <div>
          <label for="f-image">Image URL</label>
          <input type="url" id="f-image" value="${escapeAttr(p.image)}" placeholder="https://…">
        </div>
        <div>
          <label for="f-affiliate">Affiliate URL</label>
          <input type="url" id="f-affiliate" value="${escapeAttr(p.affiliateUrl)}" placeholder="https://…">
        </div>
      </div>

      <div class="admin-form-row admin-form-row--split">
        <div>
          <label for="f-price">Price <span class="field-hint">Optional. Verify before publishing.</span></label>
          <input type="text" id="f-price" value="${escapeAttr(p.price)}" placeholder="$24.99">
        </div>
        <div>
          <label for="f-date">Publication date</label>
          <input type="date" id="f-date" value="${escapeAttr(p.publicationDate)}">
        </div>
      </div>

      <div class="admin-form-row">
        <label for="f-tags">Tags <span class="field-hint">Comma-separated. Used by search.</span></label>
        <input type="text" id="f-tags" value="${escapeAttr((p.tags || []).join(", "))}" placeholder="wireless, audio, travel">
      </div>

      <fieldset class="admin-fieldset">
        <legend>Food fields (optional — leave blank to hide on the post page)</legend>
        <div class="admin-form-row">
          <label for="f-nutrition">Nutrition information <span class="field-hint">One "Label: Value" per line, e.g. Calories: 150</span></label>
          <textarea id="f-nutrition" rows="4">${escapeHtml(objectToLines(p.nutrition))}</textarea>
        </div>
        <div class="admin-form-row">
          <label for="f-ingredients">Ingredients / key info <span class="field-hint">One per line.</span></label>
          <textarea id="f-ingredients" rows="3">${escapeHtml((p.ingredients || []).join("\n"))}</textarea>
        </div>
        <div class="admin-form-row">
          <label for="f-benefits">Benefits <span class="field-hint">One per line. Only include claims you can source.</span></label>
          <textarea id="f-benefits" rows="3">${escapeHtml((p.benefits || []).join("\n"))}</textarea>
        </div>
        <div class="admin-form-row">
          <label for="f-considerations">Considerations <span class="field-hint">One per line, e.g. allergens.</span></label>
          <textarea id="f-considerations" rows="3">${escapeHtml((p.considerations || []).join("\n"))}</textarea>
        </div>
      </fieldset>

      <fieldset class="admin-fieldset">
        <legend>Product fields (optional — leave blank to hide on the post page)</legend>
        <div class="admin-form-row">
          <label for="f-specs">Specifications <span class="field-hint">One "Label: Value" per line, e.g. Battery life: 30 hours</span></label>
          <textarea id="f-specs" rows="4">${escapeHtml(objectToLines(p.specifications))}</textarea>
        </div>
        <div class="admin-form-row admin-form-row--split">
          <div>
            <label for="f-pros">Pros <span class="field-hint">One per line.</span></label>
            <textarea id="f-pros" rows="3">${escapeHtml((p.pros || []).join("\n"))}</textarea>
          </div>
          <div>
            <label for="f-cons">Cons <span class="field-hint">One per line.</span></label>
            <textarea id="f-cons" rows="3">${escapeHtml((p.cons || []).join("\n"))}</textarea>
          </div>
        </div>
      </fieldset>

      <div class="admin-actions">
        <button type="submit" class="btn btn-primary">${editing ? "Save changes" : "Publish post"}</button>
        ${editing ? '<button type="button" class="btn btn-danger" id="delete-post-btn">Delete post</button>' : ""}
      </div>
    </form>
  `;

  // Auto-fill the id field from the title, only while creating a new post
  // and only if the user hasn't typed a custom id yet.
  if (!editing) {
    const titleInput = document.getElementById("f-title");
    const idInput = document.getElementById("f-id");
    let idManuallyEdited = false;
    idInput.addEventListener("input", () => (idManuallyEdited = true));
    titleInput.addEventListener("input", () => {
      if (!idManuallyEdited) idInput.value = slugify(titleInput.value);
    });
  }

  document.getElementById("post-form").addEventListener("submit", (e) => {
    e.preventDefault();
    handleSavePost(editing);
  });

  const deleteBtn = document.getElementById("delete-post-btn");
  if (deleteBtn) {
    deleteBtn.addEventListener("click", () => handleDeletePost(editing));
  }
}

function handleSavePost(editing) {
  const id = document.getElementById("f-id").value.trim();
  const title = document.getElementById("f-title").value.trim();

  if (!id || !title) {
    showToast("Title and URL id are required.", true);
    return;
  }

  const duplicate = posts.find((p) => p.id === id && p.id !== (editing ? editing.id : null));
  if (duplicate) {
    showToast(`A post with the id "${id}" already exists — choose a different one.`, true);
    return;
  }

  const postData = {
    id,
    title,
    category: document.getElementById("f-category").value,
    image: document.getElementById("f-image").value.trim(),
    shortDescription: document.getElementById("f-short").value.trim(),
    content: parseLines(document.getElementById("f-content").value),
    tags: document.getElementById("f-tags").value.split(",").map((t) => t.trim()).filter(Boolean),
    affiliateUrl: document.getElementById("f-affiliate").value.trim(),
    price: document.getElementById("f-price").value.trim(),
    publicationDate: document.getElementById("f-date").value || new Date().toISOString().slice(0, 10),
    nutrition: parseKeyValue(document.getElementById("f-nutrition").value),
    ingredients: parseLines(document.getElementById("f-ingredients").value),
    benefits: parseLines(document.getElementById("f-benefits").value),
    considerations: parseLines(document.getElementById("f-considerations").value),
    specifications: parseKeyValue(document.getElementById("f-specs").value),
    pros: parseLines(document.getElementById("f-pros").value),
    cons: parseLines(document.getElementById("f-cons").value),
  };

  // If the id changed while editing, remove the old entry first.
  if (editing && editing.id !== id) {
    deletePost(editing.id);
  }

  savePost(postData);
  selectedId = id;
  renderList();
  renderForm();
  showToast(editing ? "Post updated." : "Post published.");
}

function handleDeletePost(editing) {
  if (!editing) return;
  if (!confirm(`Delete "${editing.title}"? This can't be undone (but you can re-add it if you have the details).`)) return;
  deletePost(editing.id);
  selectedId = null;
  renderList();
  renderForm();
  showToast("Post deleted.");
}

function renderCategoryForm() {
  const editing = selectedId ? categories.find((c) => c.id === selectedId) : null;
  const c = editing || { id: "", name: "", description: "", color: "#4A6FA5", icon: "🏷️" };

  mainEl.innerHTML = `
    <h2>${editing ? "Edit category" : "New category"}</h2>
    <p class="admin-main__subtitle">${editing ? `Editing “${escapeHtml(editing.name)}”` : "Categories show up automatically in the nav and filters."}</p>

    <form id="category-form">
      <div class="admin-form-row admin-form-row--split">
        <div>
          <label for="c-name">Name</label>
          <input type="text" id="c-name" required value="${escapeAttr(c.name)}">
        </div>
        <div>
          <label for="c-icon">Icon <span class="field-hint">A single emoji works well.</span></label>
          <input type="text" id="c-icon" value="${escapeAttr(c.icon)}" maxlength="4">
        </div>
      </div>

      <div class="admin-form-row">
        <label for="c-id">URL id <span class="field-hint">Auto-filled from the name. Changing it on an existing category will orphan its posts until you update them.</span></label>
        <input type="text" id="c-id" required value="${escapeAttr(c.id)}">
      </div>

      <div class="admin-form-row">
        <label for="c-description">Description</label>
        <textarea id="c-description" rows="2">${escapeHtml(c.description)}</textarea>
      </div>

      <div class="admin-form-row">
        <label for="c-color">Accent color <span class="field-hint">Used for card tags and the category pill.</span></label>
        <input type="color" id="c-color" value="${escapeAttr(c.color || "#4A6FA5")}" style="width:80px; padding:4px;">
      </div>

      <div class="admin-actions">
        <button type="submit" class="btn btn-primary">${editing ? "Save changes" : "Add category"}</button>
        ${editing ? '<button type="button" class="btn btn-danger" id="delete-category-btn">Delete category</button>' : ""}
      </div>
    </form>
  `;

  if (!editing) {
    const nameInput = document.getElementById("c-name");
    const idInput = document.getElementById("c-id");
    let idManuallyEdited = false;
    idInput.addEventListener("input", () => (idManuallyEdited = true));
    nameInput.addEventListener("input", () => {
      if (!idManuallyEdited) idInput.value = slugify(nameInput.value);
    });
  }

  document.getElementById("category-form").addEventListener("submit", (e) => {
    e.preventDefault();
    handleSaveCategory(editing);
  });

  const deleteBtn = document.getElementById("delete-category-btn");
  if (deleteBtn) {
    deleteBtn.addEventListener("click", () => handleDeleteCategory(editing));
  }
}

function handleSaveCategory(editing) {
  const id = document.getElementById("c-id").value.trim();
  const name = document.getElementById("c-name").value.trim();

  if (!id || !name) {
    showToast("Name and URL id are required.", true);
    return;
  }

  const duplicate = categories.find((c) => c.id === id && c.id !== (editing ? editing.id : null));
  if (duplicate) {
    showToast(`A category with the id "${id}" already exists — choose a different one.`, true);
    return;
  }

  const categoryData = {
    id,
    name,
    description: document.getElementById("c-description").value.trim(),
    color: document.getElementById("c-color").value,
    icon: document.getElementById("c-icon").value.trim() || "🏷️",
  };

  if (editing && editing.id !== id) {
    // Update any posts pointing at the old category id so they aren't orphaned.
    posts.forEach((p) => {
      if (p.category === editing.id) p.category = id;
    });
    persistPosts();
    deleteCategory(editing.id);
  }

  saveCategory(categoryData);
  selectedId = id;
  renderList();
  renderForm();
  showToast(editing ? "Category updated." : "Category added.");
}

function handleDeleteCategory(editing) {
  if (!editing) return;
  if (!confirm(`Delete category "${editing.name}"?`)) return;
  try {
    deleteCategory(editing.id);
    selectedId = null;
    renderList();
    renderForm();
    showToast("Category deleted.");
  } catch (err) {
    showToast(err.message, true);
  }
}

// ---------------------------------------------------------------
// SMALL HELPERS
// ---------------------------------------------------------------
function parseLines(text) {
  return (text || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function parseKeyValue(text) {
  const result = {};
  parseLines(text).forEach((line) => {
    const separatorIndex = line.indexOf(":");
    if (separatorIndex === -1) return;
    const label = line.slice(0, separatorIndex).trim();
    const value = line.slice(separatorIndex + 1).trim();
    if (label) result[label] = value;
  });
  return result;
}

function objectToLines(obj) {
  if (!obj) return "";
  return Object.entries(obj)
    .map(([label, value]) => `${label}: ${value}`)
    .join("\n");
}

function escapeAttr(str) {
  return escapeHtml(str);
}

let toastTimeout;
function showToast(message, isError) {
  clearTimeout(toastTimeout);
  const existing = document.querySelector(".admin-toast");
  if (existing) existing.remove();

  const toast = document.createElement("div");
  toast.className = "admin-toast" + (isError ? " admin-toast--error" : "");
  toast.textContent = message;
  document.body.appendChild(toast);

  toastTimeout = setTimeout(() => toast.remove(), 3500);
}

init();
