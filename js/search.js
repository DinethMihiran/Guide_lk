/**
 * search.js
 * ---------------------------------------------------------------
 * Pure search logic, kept separate from any DOM/rendering code
 * so it can be reused (homepage search bar today; a filters
 * sidebar or an API-backed search later) without changes.
 * ---------------------------------------------------------------
 */

// Returns posts whose title, description, category name, or tags
// contain the query text (case-insensitive). Empty query returns
// everything unchanged.
function searchPosts(allPosts, query) {
  const q = (query || "").trim().toLowerCase();
  if (!q) return allPosts;

  return allPosts.filter((post) => {
    const cat = getCategory(post.category);
    const haystack = [
      post.title,
      post.shortDescription,
      cat.name,
      ...(post.tags || []),
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(q);
  });
}

// Returns posts belonging to the given category id.
// Empty/undefined categoryId returns everything unchanged.
function filterByCategory(allPosts, categoryId) {
  if (!categoryId) return allPosts;
  return allPosts.filter((post) => post.category === categoryId);
}
