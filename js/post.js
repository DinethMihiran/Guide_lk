/**
 * post.js
 * ---------------------------------------------------------------
 * Renders ONE post into post.html, based on the `id` in the URL
 * (post.html?id=some-post-id). This is the "template" the brief
 * asked for — there is only ever this one file/page, no matter
 * how many posts data.js contains.
 * ---------------------------------------------------------------
 */

const postRootEl = document.getElementById("post-root");
const siteNavEl = document.querySelector(".site-nav");

function renderCategoryLinksInNav() {
  const links = categories
    .map(
      (cat) =>
        `<a href="index.html?category=${encodeURIComponent(cat.id)}">${cat.icon} ${cat.name}</a>`
    )
    .join("");
  siteNavEl.insertAdjacentHTML("beforeend", links);
}

function init() {
  renderCategoryLinksInNav();

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const post = posts.find((p) => p.id === id);

  if (!post) {
    renderNotFound();
    return;
  }

  renderPost(post);
}

function renderNotFound() {
  postRootEl.innerHTML = `
    <div class="container" style="padding:70px 0;">
      <p class="hero__eyebrow">404</p>
      <h1>We couldn't find that post</h1>
      <p style="color:var(--color-ink-soft); max-width:50ch;">
        It may have been removed, or the link might be out of date.
      </p>
      <p><a href="index.html" style="color:var(--color-signal-ink); font-weight:700;">← Back to all posts</a></p>
    </div>
  `;
}

function renderPost(post) {
  const cat = getCategory(post.category);

  // Update tab title + meta description
  document.getElementById("page-title").textContent = `${post.title} — Field Guide`;
  document.getElementById("page-description").setAttribute("content", post.shortDescription || "");

  const contentParagraphs = (post.content || [])
    .map((para) => `<p>${escapeHtml(para)}</p>`)
    .join("");

  const nutritionBlock = renderKeyValueBlock("Nutrition Information", post.nutrition);
  const specsBlock = renderKeyValueBlock("Specifications", post.specifications);
  const ingredientsBlock = renderListBlock("Ingredients / Key Info", post.ingredients);
  const benefitsBlock = renderListBlock("Benefits", post.benefits);
  const considerationsBlock = renderListBlock("Considerations", post.considerations);
  const prosConsBlock = renderProsConsBlock(post.pros, post.cons);

  const tagsBlock = (post.tags || []).length
    ? `<div class="tag-list">${post.tags.map((t) => `<span class="tag-chip">#${escapeHtml(t)}</span>`).join("")}</div>`
    : "";

  postRootEl.innerHTML = `
    <div class="post-hero" style="--cat-color:${cat.color}">
      <div class="container">
        <p class="breadcrumb">
          <a href="index.html">All posts</a> ›
          <a href="index.html?category=${encodeURIComponent(cat.id)}">${escapeHtml(cat.name)}</a>
        </p>

        <div class="post-hero__grid">
          <div>
            <span class="post-hero__category">${cat.icon} ${escapeHtml(cat.name)}</span>
            <h1 class="post-hero__title">${escapeHtml(post.title)}</h1>
            <p class="post-hero__date">Published ${formatDate(post.publicationDate)}</p>
            <p class="post-hero__desc">${escapeHtml(post.shortDescription)}</p>
            ${tagsBlock}
          </div>

          <div>
            <img class="post-hero__image" src="${post.image}" alt="${escapeHtml(post.title)}">
            <div class="affiliate-box">
              ${post.price ? `<span class="affiliate-box__price">${escapeHtml(post.price)}</span>` : ""}
              <p class="affiliate-box__note">Price and availability are set by the retailer and may change.</p>
              <a class="affiliate-button" href="${post.affiliateUrl || "#"}" target="_blank" rel="nofollow sponsored noopener">
                View / Buy →
              </a>
              <p class="affiliate-disclosure">This is an affiliate link — we may earn a commission at no extra cost to you.</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="container post-body">
      <div class="post-body__lede">${contentParagraphs}</div>
      ${nutritionBlock}
      ${specsBlock}
      ${ingredientsBlock}
      ${prosConsBlock}
      ${benefitsBlock}
      ${considerationsBlock}
    </div>

    ${renderRelatedSection(post)}
  `;
}

// Shows up to 3 other posts from the same category, if any exist.
function renderRelatedSection(post) {
  const related = posts
    .filter((p) => p.category === post.category && p.id !== post.id)
    .slice(0, 3);

  if (!related.length) return "";

  return `
    <div class="container">
      <h2 class="post-block__title related-heading">You might also like</h2>
      <div class="post-grid">
        ${renderPostGrid(related)}
      </div>
    </div>
  `;
}

init();
