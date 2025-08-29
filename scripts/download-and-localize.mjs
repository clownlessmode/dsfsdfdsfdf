// Node 18+
import fs from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const INPUT_JSON =
  process.argv[2] || path.join(ROOT, "products_with_images.json");
const TS_FILE =
  process.argv[3] || path.join(ROOT, "src/2_entities/product/config/mock.ts");
const PUBLIC_DIR = process.argv[4] || path.join(ROOT, "public/products");

async function ensureDir(dirPath) {
  await fs.mkdir(dirPath, { recursive: true });
}

async function download(url, destFile) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  const ab = await res.arrayBuffer();
  await fs.writeFile(destFile, Buffer.from(ab));
}

async function run() {
  const raw = await fs.readFile(INPUT_JSON, "utf-8");
  const products = JSON.parse(raw);
  await ensureDir(PUBLIC_DIR);

  for (const p of products) {
    const id = p.id;
    const url = p.image;
    const fileName = `${id}.jpg`;
    const dest = path.join(PUBLIC_DIR, fileName);
    try {
      await download(url, dest);
      console.log(`saved ${fileName}`);
    } catch (e) {
      console.warn(`skip ${id}: ${e?.message || e}`);
    }
  }

  const tsContent = await fs.readFile(TS_FILE, "utf-8");
  // Replace image: "..." within each product object based on id
  const replaced = tsContent.replace(
    /(id:\s*(\d+),[\s\S]*?image:\s*")([^"]*)("\s*,)/g,
    (m, p1, id, _oldUrl, p4) => {
      return `${p1}/products/${id}.jpg${p4}`;
    }
  );

  await fs.writeFile(TS_FILE, replaced, "utf-8");
  console.log("Rewrote image URLs in mock.ts to local /products/*.jpg");
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
