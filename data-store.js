/**
 * data-store.js
 * ---------------------------------------------------------------
 * The ONLY file that knows where content comes from and how it's
 * saved. Everything else (render.js, search.js, main.js, post.js,
 * admin.js) just reads the `posts` / `categories` arrays this
 * file fills in — they never touch storage directly.
 *
 * HOW CONTENT IS STORED RIGHT NOW:
 *   - The real content lives in /data/posts.json and
 *     /data/categories.json — plain JSON, no code at all.
 *   - Changes made in admin.html are saved in the browser
 *     (localStorage) as an "overlay" on top of those files, so
 *     you can try edits instantly without a backend.
 *   - To make an edit permanent / visible to other visitors,
 *     use the "Export" button in admin.html and replace the
 *     matching file in /data. That's a pure data file — you're
 *     still never touching HTML, CSS, or the JS components.
 *
 * WHEN YOU ADD A REAL BACKEND LATER:
 *   Replace the body of loadData() with a fetch() to your API,
 *   and replace persistPosts()/persistCategories() with POST/PUT
 *   requests. Nothing in render.js, search.js, main.js, post.js,
 *   or admin.js needs to change, because they only ever call the
 *   functions in this file — never localStorage or fetch directly.
 * ---------------------------------------------------------------
 */

// Filled in by loadData(). Other files read these as globals,
// exactly like before — just populated asynchronously now.
let posts = [];
let categories = [];

const STORAGE_KEY_POSTS = "fieldguide_posts_overlay";
const STORAGE_KEY_CATEGORIES = "fieldguide_categories_overlay";

// Call this once, before any page tries to use `posts`/`categories`.
// Loads the base JSON files, then applies any local admin edits on top.
async function loadData() {
  const [baseCategories, basePosts] = await Promise.all([
    fetchJson("categories.json"),
    fetchJson("posts.json"),
  ]);

  const localPosts = readLocal(STORAGE_KEY_POSTS);
  const localCategories = readLocal(STORAGE_KEY_CATEGORIES);

  posts = localPosts !== null ? localPosts : basePosts;
  categories = localCategories !== null ? localCategories : baseCategories;

  return { posts, categories };
}

async function fetchJson(path) {
  const res = await fetch(path);
  if (!res.ok) {
    throw new Error(
      `Could not load ${path} (HTTP ${res.status}). ` +
        `Note: JSON files can't be fetched from a "file://" address in most ` +
        `browsers — run a local server (see README) or host the site.`
    );
  }
  return res.json();
}

function readLocal(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.warn("Could not read local content overlay for", key, e);
    return null;
  }
}

function persistPosts() {
  localStorage.setItem(STORAGE_KEY_POSTS, JSON.stringify(posts));
}

function persistCategories() {
  localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(categories));
}

// ---------------------------------------------------------------
// POST CRUD
// ---------------------------------------------------------------

// Creates a new post or, if a post with the same id already
// exists, replaces it (used for both "add" and "edit" in admin.js).
function savePost(postData) {
  const index = posts.findIndex((p) => p.id === postData.id);
  if (index === -1) {
    posts.push(postData);
  } else {
    posts[index] = postData;
  }
  persistPosts();
  return postData;
}

function deletePost(id) {
  posts = posts.filter((p) => p.id !== id);
  persistPosts();
}

// ---------------------------------------------------------------
// CATEGORY CRUD
// ---------------------------------------------------------------

function saveCategory(categoryData) {
  const index = categories.findIndex((c) => c.id === categoryData.id);
  if (index === -1) {
    categories.push(categoryData);
  } else {
    categories[index] = categoryData;
  }
  persistCategories();
  return categoryData;
}

// Refuses to delete a category that still has posts in it, so the
// site can never end up with orphaned posts pointing at nothing.
function deleteCategory(id) {
  const inUse = posts.some((p) => p.category === id);
  if (inUse) {
    throw new Error(
      "This category still has posts in it. Move or delete those posts first."
    );
  }
  categories = categories.filter((c) => c.id !== id);
  persistCategories();
}

// ---------------------------------------------------------------
// UTILITIES used by admin.js
// ---------------------------------------------------------------

// Turns "USB-C Hub!" into "usb-c-hub" for use as an id/URL slug.
function slugify(text) {
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// True if any admin edits are stored locally (i.e. content differs
// from the shipped /data JSON files in this browser).
function hasLocalEdits() {
  return (
    localStorage.getItem(STORAGE_KEY_POSTS) !== null ||
    localStorage.getItem(STORAGE_KEY_CATEGORIES) !== null
  );
}

// Wipes local edits and reloads from the shipped JSON files.
function discardLocalEdits() {
  localStorage.removeItem(STORAGE_KEY_POSTS);
  localStorage.removeItem(STORAGE_KEY_CATEGORIES);
}

// Triggers a browser download of the current data as a .json file,
// so it can be used to overwrite /data/posts.json or
// /data/categories.json and become the new permanent content.
function downloadJson(filename, data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
