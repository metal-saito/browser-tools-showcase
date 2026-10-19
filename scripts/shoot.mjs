// og.png（1200×630 @2x）、screenshot-estimate.png（1280×800 @2x）、screenshot-top.png（トップ全画面）を生成する。
//   npm run shoot
// 事前に: npm i -D playwright && npx playwright install chromium
import { chromium } from "playwright";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const fileUrl = (rel) => "file://" + path.join(root, rel).replace(/\\/g, "/");

const b = await chromium.launch();
const light = { colorScheme: "light" }; // ダークモード環境でも常にライト配色で撮影する

// 1) OG 画像
{
  const p = await b.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 2, ...light });
  await p.goto(fileUrl("og.html"), { waitUntil: "networkidle" });
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(500);
  await p.screenshot({ path: path.join(root, "og.png") });
  console.log("og.png written (2400x1260)");
}

// 2) 見積シミュレーターのスクリーンショット（完了条件の組み合わせを選択した状態）
{
  const p = await b.newPage({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 2, ...light });
  await p.goto(fileUrl("estimate/index.html") + "?layout=2ldk&items=aircon:2,kitchen,bath&mods=weekend&area=near", { waitUntil: "networkidle" });
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(500);
  await p.screenshot({ path: path.join(root, "screenshot-estimate.png") });
  console.log("screenshot-estimate.png written (2560x1600)");
}

// 3) トップページ（ライト配色・全画面）
{
  const p = await b.newPage({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 2, ...light });
  await p.goto(fileUrl("index.html"), { waitUntil: "networkidle" });
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(500);
  await p.screenshot({ path: path.join(root, "screenshot-top.png"), fullPage: true });
  console.log("screenshot-top.png written (full page)");
}

await b.close();
