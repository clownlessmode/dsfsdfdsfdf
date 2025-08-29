// Node 18+
// usage: node fetch-images-unsplash.mjs [input=products.json] [output=products_with_images.json]

import fs from "fs/promises";
import { Buffer } from "node:buffer";

const input = process.argv[2] || "src/2_entities/product/config/mock.ts";
const output =
  process.argv[3] ||
  (input.endsWith(".json")
    ? "products_with_images.json"
    : input.replace(/\.ts$/, ".updated.ts"));
const DIMS = { width: 800, height: 600 }; // можешь поменять размеры
const providerArg =
  process.argv.find((a) => a.startsWith("--provider="))?.split("=")[1] ||
  "unsplash_search"; // default: parse Unsplash search HTML for final images.unsplash.com links

// Группы -> англ. подсказки
const GROUP_KEYWORDS = {
  1: ["new", "trending", "food"],
  2: ["drink", "beverage"],
  3: ["burger"],
  4: ["pizza"],
  5: ["salad"],
  6: ["dessert", "sweet"],
  7: ["sauce", "dip"],
  8: ["hot dish", "main course"],
  9: ["soup"],
};

// Ключевые русские фрагменты названий -> англ. подсказки
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

function buildQuery(product) {
  const groupHints = (product.group || [])
    .flatMap((g) => GROUP_KEYWORDS[g] || [])
    .filter(Boolean);

  const nameHints = hintsFromText(product.name);
  const subgroupHints = (product.subgroup || []).flatMap(hintsFromText);

  const tags = [...new Set([...groupHints, ...nameHints, ...subgroupHints])];

  // если совсем пусто — базовые подсказки
  if (tags.length === 0) tags.push("food");

  // Можно усилить релевантность: добавим конкретное слово из name в латинице, если узнаём
  // Например "Маргарита" → margherita уже поймается выше.
  return tags.join(",");
}

function buildEnglishSearchQuery(product) {
  const csv = buildQuery(product);
  const tags = csv
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
  const blacklist = new Set(["new", "trending", "food"]);
  const filtered = tags.filter((t) => !blacklist.has(t));
  const unique = Array.from(new Set(filtered));
  return unique.join(" ") || "food";
}

async function followRedirects(url, method = "HEAD", maxHops = 6) {
  let current = url;
  for (let i = 0; i < maxHops; i++) {
    let res;
    try {
      res = await fetch(current, { method, redirect: "manual" });
    } catch {
      // сетевой сбой — прервёмся
      return current;
    }
    // Успех без редиректа
    if (res.status >= 200 && res.status < 300) return current;

    // Редирект
    if (res.status >= 300 && res.status < 400) {
      const loc = res.headers.get("location");
      if (!loc) return current;
      current = new URL(loc, current).href;
      // Как только дошли до конечной картинки — возвращаем
      if (current.includes("images.unsplash.com/")) return current;
      continue;
    }

    // Если HEAD не зашёл — пробуем GET один раз
    if (method === "HEAD") {
      return followRedirects(current, "GET", maxHops - i);
    }
    return current;
  }
  return current;
}

async function getUnsplashImageUrl(query, { width = 800, height = 600 } = {}) {
  // featured → более релевантные
  const src = `https://source.unsplash.com/featured/${width}x${height}/?${encodeURIComponent(
    query
  )}`;
  // Явно разрулим редиректы до финального images.unsplash.com/plus.unsplash.com
  const final = await followRedirects(src, "GET");
  return ensureUnsplashParams(final, { width, height });
}

function ensureUnsplashParams(url, { width = 800, height = 600 } = {}) {
  try {
    const u = new URL(url);
    if (
      u.hostname.includes("images.unsplash.com") ||
      u.hostname.includes("plus.unsplash.com")
    ) {
      u.searchParams.set("w", String(width));
      u.searchParams.set("q", "60");
      u.searchParams.set("auto", "format");
      u.searchParams.set("fit", "crop");
      return u.toString();
    }
    return url;
  } catch {
    return url;
  }
}

async function getUnsplashSearchImageUrl(
  query,
  { width = 800, height = 600 } = {}
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
  const match = urls?.[0]?.[0];
  if (!match) {
    // fallback: featured redirect variant
    return getUnsplashImageUrl(query, { width, height });
  }
  const cleaned = match.replace(/&amp;/g, "&").replace(/amp%3B/g, "");
  return ensureUnsplashParams(cleaned, { width, height });
}

async function urlOk(url) {
  if (
    /loremflickr\.com|picsum\.photos|placehold\.co|images\.unsplash\.com|plus\.unsplash\.com|source\.unsplash\.com/.test(
      url
    )
  )
    return true;
  try {
    const res = await fetch(url, { method: "HEAD" });
    return res.status >= 200 && res.status < 300;
  } catch {
    return false;
  }
}

function buildSeed(product) {
  const id = product?.id ?? 0;
  const name = String(product?.name || "").replace(/\s+/g, "_");
  return `${id}_${name}`.slice(0, 80);
}

function buildLoremFlickrUrl(query, { width = 800, height = 600 } = {}, seed) {
  const tagsPath = encodeURIComponent(query).replace(/%2C/g, ",");
  const lock = seed ? `?lock=${encodeURIComponent(seed)}` : "";
  return `https://loremflickr.com/${width}/${height}/${tagsPath}${lock}`;
}

function buildPicsumUrl({ width = 800, height = 600 } = {}, seed) {
  const s = seed
    ? encodeURIComponent(seed)
    : Math.random().toString(36).slice(2);
  return `https://picsum.photos/seed/${s}/${width}/${height}.jpg`;
}

function toHex(n) {
  return n.toString(16).padStart(2, "0");
}

function hashString(str) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h >>> 0;
}

function buildPlaceholdUrl(product, { width = 800, height = 600 } = {}) {
  const name = String(product?.name || "Food");
  const seed = buildSeed(product);
  const h = hashString(seed);
  const r = (h & 0xff) >>> 0;
  const g = (h >> 8) & 0xff;
  const b = (h >> 16) & 0xff;
  const bg = `${toHex(r)}${toHex(g)}${toHex(b)}`;
  const fg = r + g + b > 3 * 128 ? "000000" : "ffffff";
  const text = encodeURIComponent(name);
  return `https://placehold.co/${width}x${height}/${bg}/${fg}?text=${text}`;
}

async function getImageUrlWithFallbacks(product, dims, preference = "auto") {
  const query = buildQuery(product);
  const seed = buildSeed(product);
  const englishQuery = buildEnglishSearchQuery(product);
  const order = [
    preference,
    "unsplash_search",
    "unsplash",
    "loremflickr",
    "picsum",
    "placehold",
  ].filter((v, i, a) => v && a.indexOf(v) === i);

  for (const prov of order) {
    try {
      if (prov === "unsplash_search") {
        const url = await getUnsplashSearchImageUrl(englishQuery, dims);
        if (await urlOk(url)) return url;
      }
      if (prov === "placehold") {
        const url = buildPlaceholdUrl(product, dims);
        if (await urlOk(url)) return url;
      }
      if (prov === "unsplash") {
        const url = await getUnsplashImageUrl(query, dims);
        if (await urlOk(url)) return url;
      }
      if (prov === "loremflickr") {
        const url = buildLoremFlickrUrl(query, dims, seed);
        if (await urlOk(url)) return url;
      }
      if (prov === "picsum") {
        const url = buildPicsumUrl(dims, seed + "_" + query);
        if (await urlOk(url)) return url;
      }
    } catch {
      // try next
    }
  }
  // если ни один не подтвердился — вернём последний вариантом picsum
  return buildPicsumUrl(dims, seed + "_fallback");
}

function isJsonPath(p = "") {
  return p.toLowerCase().endsWith(".json");
}

function isTsPath(p = "") {
  return p.toLowerCase().endsWith(".ts");
}

async function readProductsFromFile(filePath) {
  const raw = await fs.readFile(filePath, "utf-8");
  if (isJsonPath(filePath)) {
    return JSON.parse(raw);
  }

  // Поддержка .ts: конвертируем модуль в ESM с export default и импортируем через data: URL
  if (isTsPath(filePath)) {
    const transformed = raw
      .replace(/^\s*import[^\n]*\n/gm, "")
      .replace(/export\s+const\s+mock\s*:\s*[^=]+=/, "export default ")
      .replace(/export\s+const\s+mock\s*=\s*/, "export default ");

    const b64 = Buffer.from(transformed, "utf-8").toString("base64");
    const mod = await import(`data:text/javascript;base64,${b64}`);
    return mod.default;
  }

  throw new Error(
    `Unsupported input format for ${filePath}. Use .json or .ts (export const mock = [...])`
  );
}

function toJsObjectLiteral(data) {
  // Превращаем массив объектов в JS-литерал, убирая кавычки с идентификаторов-ключей
  const json = JSON.stringify(data, null, 2);
  return json.replace(/"([a-zA-Z_][a-zA-Z0-9_]*)":/g, "$1:");
}

async function writeProductsToFile(products, inputPath, outputPath) {
  const outPath = outputPath || inputPath;
  if (isJsonPath(outPath)) {
    await fs.writeFile(outPath, JSON.stringify(products, null, 2), "utf-8");
    return;
  }

  if (isTsPath(outPath)) {
    // Берём исходный .ts (чтобы сохранить импорты/типизацию), заменяем массив mock
    const originalTs = await fs.readFile(inputPath, "utf-8");
    const arrayLiteral = toJsObjectLiteral(products);

    const replaced = originalTs.replace(
      /export\s+const\s+mock(\s*:\s*[^=]+)?\s*=\s*\[[\s\S]*?\];\s*$/,
      (_, typeAnn = "") => `export const mock${typeAnn} = ${arrayLiteral};\n`
    );

    await fs.writeFile(outPath, replaced, "utf-8");
    return;
  }

  throw new Error(
    `Unsupported output format for ${outPath}. Use .json or .ts for output.`
  );
}

async function main() {
  const products = await readProductsFromFile(input);

  const updated = [];
  for (const p of products) {
    try {
      const url = await getImageUrlWithFallbacks(p, DIMS, providerArg);
      updated.push({ ...p, image: url });
      console.log(`✔ ${p.name} → ${url}`);
      await sleep(250); // слегка троттлим
    } catch (e) {
      console.warn(`⚠ ${p.name} — не удалось, оставляю старую картинку.`, e);
      updated.push(p);
    }
  }

  await writeProductsToFile(updated, input, output);
  console.log(`\nГотово: ${output}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
