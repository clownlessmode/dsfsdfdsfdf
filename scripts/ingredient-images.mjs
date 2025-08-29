// Node 18+
import fs from "node:fs/promises";
import { Buffer } from "node:buffer";

const TS_FILE = process.argv[2] || "src/2_entities/product/config/mock.ts";
const WIDTH = 800;
const HEIGHT = 600;

const NAME_HINTS = [
  ["маргарит", "margherita"],
  ["пепперон", "pepperoni"],
  ["четыре сыра", "four cheese"],
  ["4 сыра", "four cheese"],
  ["гавай", "hawaiian"],
  ["диабло", "diablo"],
  ["вегет", "vegetarian"],
  ["барбекю", "bbq"],
  ["куриц", "chicken"],
  ["лосос", "salmon"],
  ["цезар", "caesar"],
  ["греческ", "greek"],
  ["мексик", "mexican"],
  ["нисуаз", "nicoise"],
  ["браун", "brownie"],
  ["чизкейк", "cheesecake"],
  ["тирамис", "tiramisu"],
  ["пломбир", "ice cream"],
  ["яблочн", "apple pie"],
  ["кола", "coca cola"],
  ["спрайт", "sprite"],
  ["лимонад", "lemonade"],
  ["латте", "latte"],
  ["капуч", "cappuccino"],
  ["жасмин", "jasmine tea"],
  ["паста", "pasta"],
  ["карбонара", "carbonara"],
  ["терияк", "teriyaki"],
  ["крем-суп", "cream soup"],
  ["гриб", "mushroom"],
  ["соус", "sauce"],
  ["чесноч", "garlic"],
  ["сырн", "cheese"],
  ["кисло", "sweet and sour"],
  ["бургер", "burger"],
  ["пицц", "pizza"],
  ["салат", "salad"],
  ["суп", "soup"],
  ["напит", "drink"],
  ["десерт", "dessert"],
  // ingredients common
  ["бекон", "bacon"],
  ["олив", "olives"],
  ["томат", "tomato"],
  ["лук", "onion"],
  ["кукуруз", "corn"],
  ["ананас", "pineapple"],
  ["перец", "pepper"],
  ["ветчин", "ham"],
  ["кревет", "shrimp"],
  ["сыр", "cheese"],
  ["моцарел", "mozzarella"],
  ["говядин", "beef"],
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function hintsFromText(text = "") {
  const s = String(text).toLowerCase();
  const out = new Set();
  for (const [ru, en] of NAME_HINTS) {
    if (s.includes(ru)) out.add(en);
  }
  return Array.from(out);
}

function englishQueryForIngredient(ingredient, product) {
  const base = hintsFromText(product?.name || "");
  const ing = [
    ...hintsFromText(ingredient?.name || ""),
    ...hintsFromText(ingredient?.description || ""),
  ];
  const words = Array.from(new Set([...ing, ...base])).filter(Boolean);
  if (words.length === 0) return "food ingredient";
  return words.join(" ");
}

async function getUnsplashSearchImageUrl(
  query,
  { width = WIDTH, height = HEIGHT } = {}
) {
  const searchUrl = `https://unsplash.com/s/photos/${encodeURIComponent(
    query
  )}`;
  const res = await fetch(searchUrl, {
    method: "GET",
    headers: {
      "user-agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
      accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
      "accept-language": "en-US,en;q=0.9",
    },
  });
  const html = await res.text();
  const urls = Array.from(
    html.matchAll(/https:\/\/(?:images|plus)\.unsplash\.com\/[^\s",)]+/g)
  );
  const first = urls?.[0]?.[0];
  if (!first) return null;
  const u = new URL(first.replace(/&amp;/g, "&").replace(/amp%3B/g, ""));
  u.searchParams.set("w", String(width));
  u.searchParams.set("q", "60");
  u.searchParams.set("auto", "format");
  u.searchParams.set("fit", "crop");
  return u.toString();
}

async function loadProductsFromTs(tsPath) {
  const raw = await fs.readFile(tsPath, "utf-8");
  const transformed = raw
    .replace(/^\s*import[^\n]*\n/gm, "")
    .replace(/export\s+const\s+mock\s*:\s*[^=]+=/, "export default ")
    .replace(/export\s+const\s+mock\s*=\s*/, "export default ");
  const b64 = Buffer.from(transformed, "utf-8").toString("base64");
  const mod = await import(`data:text/javascript;base64,${b64}`);
  return mod.default;
}

async function main() {
  const products = await loadProductsFromTs(TS_FILE);
  const idToIngIdToUrl = new Map();

  for (const p of products) {
    if (!Array.isArray(p.ingredients) || p.ingredients.length === 0) continue;
    for (const ing of p.ingredients) {
      const q = englishQueryForIngredient(ing, p);
      try {
        const url = await getUnsplashSearchImageUrl(q);
        if (!url) continue;
        if (!idToIngIdToUrl.has(p.id)) idToIngIdToUrl.set(p.id, new Map());
        idToIngIdToUrl.get(p.id).set(ing.id, url);
        console.log(`✔ ${p.name} / ${ing.name} → ${url}`);
      } catch (e) {
        console.warn(`⚠ skip ${p.name} / ${ing?.name}`);
      }
      await sleep(200);
    }
  }

  // Rewrite TS file in place replacing ingredient image URLs by id
  let ts = await fs.readFile(TS_FILE, "utf-8");
  for (const [productId, map] of idToIngIdToUrl) {
    for (const [ingId, url] of map) {
      const pattern = new RegExp(
        `(id:\\s*${productId}[^]*?ingredients:\\s*\\[[^]*?id:\\s*${ingId}[^]*?image:\\s*")([^"]*)(")`,
        "m"
      );
      ts = ts.replace(pattern, `$1${url}$3`);
    }
  }
  await fs.writeFile(TS_FILE, ts, "utf-8");
  console.log("Updated ingredient image URLs in", TS_FILE);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
