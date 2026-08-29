/**
 * data.js
 * ---------------------------------------------------------------
 * THIS FILE IS YOUR "DATABASE" FOR NOW.
 *
 * To add a new post: copy an existing object inside `posts`,
 * change the values, and give it a new unique `id`. Nothing else
 * in the site needs to change — the homepage grid, search, and
 * the post page all read from this file automatically.
 *
 * To add a new category: add an object to `categories` below.
 * It will automatically show up in the category navigation.
 *
 * IMPORTANT: The sample posts below use PLACEHOLDER facts
 * (prices, specs, nutrition numbers) so you can see the layout
 * working. Replace them with real, verified information from
 * manufacturer sites / nutrition databases before publishing.
 * Do not leave invented numbers live on the real site.
 * ---------------------------------------------------------------
 */

// ---------------------------------------------------------------
// CATEGORIES
// Each category needs: id, name, description, color (used for
// the little tag/accent shown on cards), and an emoji icon
// (swap for a real icon/image later if you like).
// ---------------------------------------------------------------
const categories = [
  {
    id: "foods",
    name: "Foods",
    description: "Reviews, nutrition breakdowns, and where to buy them.",
    color: "#6B8F71",
    icon: "🌾",
  },
  {
    id: "electronics",
    name: "Electronics",
    description: "Specs, comparisons, and honest pros & cons.",
    color: "#4A6FA5",
    icon: "🔌",
  },
  {
    id: "gadgets",
    name: "Gadgets",
    description: "Small tools and accessories worth knowing about.",
    color: "#C1666B",
    icon: "🧭",
  },
  {
    id: "home",
    name: "Home Products",
    description: "Things that make a house run a little smoother.",
    color: "#B8862E",
    icon: "🏠",
  },
];

// ---------------------------------------------------------------
// POSTS
// Supported fields (only `id`, `title`, `category`, `image`,
// `shortDescription`, `content`, `affiliateUrl`, and
// `publicationDate` are required — everything else is optional
// and will simply be skipped in the layout if left out):
//
//   id                 unique text, used in the URL (post.html?id=...)
//   title              string
//   category           must match a category id above
//   image              URL or path to an image
//   shortDescription   1–2 sentences, shown on cards
//   content            array of paragraph strings (full article body)
//   tags               array of strings, used by search
//   affiliateUrl       the outbound affiliate link
//   price              optional string, e.g. "$24.99"
//   publicationDate    "YYYY-MM-DD"
//   specifications     optional {label: value} object (electronics/gadgets)
//   nutrition          optional {label: value} object (food)
//   ingredients        optional array of strings (food)
//   benefits           optional array of strings (food)
//   considerations     optional array of strings (food)
//   pros               optional array of strings (products)
//   cons               optional array of strings (products)
// ---------------------------------------------------------------
const posts = [
  {
    id: "steel-cut-oats-overnight",
    title: "Steel-Cut Oats for Overnight Breakfasts",
    category: "foods",
    image: "https://picsum.photos/seed/oats/800/600",
    // EDIT THIS TEXT to change the description shown under this post on the homepage.
    shortDescription:
      "A slow-cooked, high-fiber breakfast staple that holds up well when prepped the night before  .",
    content: [
      "Replace this paragraph with a real introduction to the food item — where it comes from, why it's worth covering, and who it's good for.",
      "Replace this paragraph with more detail: how it's typically prepared, texture, flavor notes, and any variations worth mentioning.",
    ],
    tags: ["breakfast", "oats", "high-fiber", "meal-prep"],
    affiliateUrl: "#",
    price: "$8.99",
    publicationDate: "2026-06-01",
    nutrition: {
      "Serving size": "REPLACE — e.g. 1/2 cup dry",
      Calories: "REPLACE with verified value",
      Protein: "REPLACE with verified value",
      Fiber: "REPLACE with verified value",
    },
    ingredients: ["REPLACE with real ingredient list"],
    benefits: ["REPLACE with a source-backed benefit"],
    considerations: ["REPLACE — e.g. allergen or preparation notes"],
  },
  {
    id: "greek-yogurt-plain",
    title: "Plain Greek Yogurt, Explained",
    category: "foods",
    image: "https://picsum.photos/seed/yogurt/800/600",
    shortDescription:
      "A protein-dense staple that works in both sweet and savory dishes.",
    content: [
      "Replace this paragraph with a real introduction: what makes Greek yogurt different from regular yogurt, and why readers might choose it.",
      "Replace this paragraph with practical detail — how to use it, what to pair it with, and what to look for on the label.",
    ],
    tags: ["dairy", "protein", "breakfast", "snack"],
    affiliateUrl: "#",
    price: "$5.49",
    publicationDate: "2026-06-03",
    nutrition: {
      "Serving size": "REPLACE",
      Calories: "REPLACE",
      Protein: "REPLACE",
      Sugar: "REPLACE",
    },
    benefits: ["REPLACE with a source-backed benefit"],
    considerations: ["REPLACE — e.g. lactose content"],
  },
  {
    id: "wireless-noise-cancel-headphones",
    title: "Wireless Noise-Cancelling Headphones — Buying Guide",
    category: "electronics",
    image: "https://picsum.photos/seed/headphones/800/600",
    shortDescription:
      "What actually matters when comparing noise-cancelling headphones, plus one solid pick.",
    content: [
      "Replace this paragraph with a real product introduction — brand, model, and who it's aimed at.",
      "Replace this paragraph with your hands-on impressions or a summary of verified reviews. Keep specific numbers (battery life, driver size) sourced from the manufacturer.",
    ],
    tags: ["headphones", "audio", "wireless", "noise-cancelling"],
    affiliateUrl: "#",
    price: "REPLACE with verified current price",
    publicationDate: "2026-06-05",
    specifications: {
      "Battery life": "REPLACE with verified spec",
      "Driver size": "REPLACE with verified spec",
      Weight: "REPLACE with verified spec",
      Connectivity: "REPLACE with verified spec",
    },
    pros: ["REPLACE with a real, verified pro"],
    cons: ["REPLACE with a real, verified con"],
  },
  {
    id: "usb-c-hub",
    title: "A 7-Port USB-C Hub for Small Desks",
    category: "electronics",
    image: "https://picsum.photos/seed/usbhub/800/600",
    shortDescription:
      "One cable in, seven ports out — useful for laptops that dropped most of their ports.",
    content: [
      "Replace this paragraph with a real introduction to the hub, its build, and what it's compatible with.",
      "Replace this paragraph with details on port layout, speed ratings, and heat/performance notes from verified sources.",
    ],
    tags: ["usb-c", "hub", "accessories", "laptop"],
    affiliateUrl: "#",
    price: "REPLACE with verified current price",
    publicationDate: "2026-06-08",
    specifications: {
      Ports: "REPLACE with verified spec",
      "Data speed": "REPLACE with verified spec",
      "Power delivery": "REPLACE with verified spec",
    },
    pros: ["REPLACE with a real, verified pro"],
    cons: ["REPLACE with a real, verified con"],
  },
  {
    id: "mini-tripod",
    title: "A Mini Tripod That Actually Fits in a Pocket",
    category: "gadgets",
    image: "https://picsum.photos/seed/tripod/800/600",
    shortDescription:
      "Flexible legs, a phone clamp, and a footprint small enough to carry every day.",
    content: [
      "Replace this paragraph with a real introduction — size, materials, and what it's designed for.",
      "Replace this paragraph with use-case detail: content creation, travel, video calls, etc.",
    ],
    tags: ["tripod", "photography", "travel", "phone accessory"],
    affiliateUrl: "#",
    price: "REPLACE with verified current price",
    publicationDate: "2026-06-10",
    specifications: {
      "Folded length": "REPLACE with verified spec",
      "Max load": "REPLACE with verified spec",
      Material: "REPLACE with verified spec",
    },
    pros: ["REPLACE with a real, verified pro"],
    cons: ["REPLACE with a real, verified con"],
  },
  {
    id: "smart-plug",
    title: "A Smart Plug Worth Setting Up",
    category: "home",
    image: "https://picsum.photos/seed/smartplug/800/600",
    shortDescription:
      "Turn any lamp or appliance into something schedulable in about five minutes.",
    content: [
      "Replace this paragraph with a real introduction — what it does, what app/ecosystem it needs.",
      "Replace this paragraph with setup notes and real-world reliability observations from verified sources.",
    ],
    tags: ["smart home", "automation", "energy"],
    affiliateUrl: "#",
    price: "REPLACE with verified current price",
    publicationDate: "2026-06-12",
    specifications: {
      "Max load": "REPLACE with verified spec",
      Connectivity: "REPLACE with verified spec",
      "App required": "REPLACE with verified spec",
    },
    pros: ["REPLACE with a real, verified pro"],
    cons: ["REPLACE with a real, verified con"],
  },
  {
    id: "bamboo-cutting-board",
    title: "A Bamboo Cutting Board That Won't Warp",
    category: "home",
    image: "https://picsum.photos/seed/cuttingboard/800/600",
    shortDescription:
      "A kitchen basic that's easy to get wrong — here's what to look for.",
    content: [
      "Replace this paragraph with a real introduction — material, size options, and care requirements.",
      "Replace this paragraph with maintenance tips and what separates a good board from a bad one.",
    ],
    tags: ["kitchen", "bamboo", "cutting board"],
    affiliateUrl: "#",
    price: "REPLACE with verified current price",
    publicationDate: "2026-06-14",
    specifications: {
      Dimensions: "REPLACE with verified spec",
      Material: "REPLACE with verified spec",
      "Dishwasher safe": "REPLACE with verified spec",
    },
    pros: ["REPLACE with a real, verified pro"],
    cons: ["REPLACE with a real, verified con"],
  },

  {
    id: "stainless-steel-water-bottle",
    title: "A Stainless Steel Water Bottle That Keeps Drinks Cold",
    category: "home",
    image: "https://picsum.photos/seed/waterbottle/800/600",
    shortDescription:
      "A durable, insulated bottle that works for both hot and cold beverages.",
    content: [
      "Replace this paragraph with a real introduction — material, insulation type, and capacity.",
      "Replace this paragraph with practical usage notes and any verified pros/cons from real users.",
    ],
    tags: ["water bottle", "insulated", "stainless steel"],
    affiliateUrl: "#",
    price: "REPLACE with verified current price",
    publicationDate: "2026-06-16",
    specifications: {
      Capacity: "REPLACE with verified spec",
      Material: "REPLACE with verified spec",
      Insulation: "REPLACE with verified spec",
    },
    pros: ["REPLACE with a real, verified pro"],
    cons: ["REPLACE with a real, verified con"],  
  }

];
