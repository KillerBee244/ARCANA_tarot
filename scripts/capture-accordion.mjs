import puppeteer from "puppeteer-core";
import fs from "fs";
import path from "path";

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const BASE_URL = "http://localhost:3000";

async function run() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  console.log("Navigating to app...");
  await page.goto(BASE_URL, { waitUntil: "networkidle0" });

  // Click start
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll("button")).find((b) =>
      b.textContent?.includes("Bắt đầu hành trình")
    );
    btn?.click();
  });
  await new Promise((r) => setTimeout(r, 600));

  // Click proceed to deck
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll("button")).find((b) =>
      b.textContent?.includes("Tiến vào kho lưu trữ bài")
    );
    btn?.click();
  });
  await new Promise((r) => setTimeout(r, 800));

  // Select 3 cards
  const cards = await page.$$(".perspective-1000 .origin-bottom");
  if (cards.length >= 3) {
    await cards[2].click();
    await cards[7].click();
    await cards[14].click();
  }
  await new Promise((r) => setTimeout(r, 600));

  // Click proceed to reveal
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll("button")).find((b) =>
      b.textContent?.includes("Tiến hành Khai Mở")
    );
    btn?.click();
  });
  await new Promise((r) => setTimeout(r, 800));

  // Skip all to reading scene
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll("button")).find((b) =>
      b.textContent?.includes("Lật tất cả")
    );
    btn?.click();
  });
  await new Promise((r) => setTimeout(r, 1200));

  // Test copy button
  console.log("Testing copy button...");
  await page.evaluate(() => {
    const copyBtn = Array.from(document.querySelectorAll("button")).find((b) =>
      b.textContent?.includes("Sao chép kết quả")
    );
    copyBtn?.click();
  });
  await new Promise((r) => setTimeout(r, 500));

  // Capture screenshot of Rulebase cards section
  const outPath = path.resolve(process.cwd(), "screenshots/aligned-rulebase-cards.png");
  await page.screenshot({ path: outPath, fullPage: true });
  console.log("Saved screenshot to:", outPath);

  await browser.close();
}

run();
