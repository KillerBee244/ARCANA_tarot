import puppeteer from "puppeteer-core";
import fs from "fs";
import path from "path";

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const BASE_URL = "http://localhost:3000";
const OUTPUT_DIR = path.resolve(process.cwd(), "screenshots");

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Helper to click element by text content
async function clickByText(page, selector, text) {
  await page.waitForFunction(
    (sel, txt) => {
      const els = Array.from(document.querySelectorAll(sel));
      return els.some((el) => el.textContent && el.textContent.includes(txt));
    },
    { timeout: 15000 },
    selector,
    text
  );

  await page.evaluate(
    (sel, txt) => {
      const els = Array.from(document.querySelectorAll(sel));
      const target = els.find((el) => el.textContent && el.textContent.includes(txt));
      if (target) {
        target.scrollIntoView({ behavior: "instant", block: "center" });
        target.click();
      } else {
        throw new Error(`Element ${sel} with text "${txt}" not found`);
      }
    },
    selector,
    text
  );
}

async function captureDevice(deviceType, viewport) {
  console.log(`\n========================================`);
  console.log(`Starting capture for: ${deviceType} (${viewport.width}x${viewport.height})`);
  console.log(`========================================`);

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-gpu"],
  });

  const page = await browser.newPage();
  await page.setViewport(viewport);

  if (deviceType === "mobile") {
    await page.setUserAgent(
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1"
    );
  }

  // Log console errors from the page
  page.on("console", (msg) => {
    if (msg.type() === "error") {
      console.log(`[Browser Console Error]:`, msg.text());
    }
  });

  page.on("pageerror", (err) => {
    console.log(`[Browser Page Error]:`, err.message);
  });

  try {
    // 1. Portal Scene
    console.log(`[1] Navigating to ${BASE_URL}...`);
    await page.goto(BASE_URL, { waitUntil: "networkidle0" });
    await page.evaluate(() => document.fonts.ready);
    await new Promise((r) => setTimeout(r, 1000));

    const s1Path = path.join(OUTPUT_DIR, `${deviceType}-01-portal.png`);
    await page.screenshot({ path: s1Path, fullPage: false });
    console.log(`Saved: ${s1Path}`);

    // Click "Bắt đầu hành trình"
    console.log(`[2] Entering Question Scene...`);
    await clickByText(page, "button", "Bắt đầu hành trình");
    await new Promise((r) => setTimeout(r, 1000));

    // Question Scene (Initial)
    const s2InitPath = path.join(OUTPUT_DIR, `${deviceType}-02-question-initial.png`);
    await page.screenshot({ path: s2InitPath, fullPage: false });
    console.log(`Saved: ${s2InitPath}`);

    // Select category "Sự nghiệp"
    console.log(`[3] Choosing category and typing question...`);
    await clickByText(page, "button", "Sự nghiệp");
    await new Promise((r) => setTimeout(r, 300));

    // Type question
    const textarea = await page.waitForSelector("textarea");
    await textarea.click();
    await textarea.type("Lộ trình phát triển sản phẩm của tôi trong quý tới sẽ ra sao?", { delay: 10 });
    await new Promise((r) => setTimeout(r, 500));

    // Question Scene (Filled)
    const s2FilledPath = path.join(OUTPUT_DIR, `${deviceType}-02-question-filled.png`);
    await page.screenshot({ path: s2FilledPath, fullPage: false });
    console.log(`Saved: ${s2FilledPath}`);

    // Click "Tiến vào kho lưu trữ bài"
    console.log(`[4] Entering Deck Selection Scene...`);
    await clickByText(page, "button", "Tiến vào kho lưu trữ bài");
    await new Promise((r) => setTimeout(r, 1200));

    // Deck Scene (Initial)
    const s3InitPath = path.join(OUTPUT_DIR, `${deviceType}-03-deck-initial.png`);
    await page.screenshot({ path: s3InitPath, fullPage: false });
    console.log(`Saved: ${s3InitPath}`);

    // Select 3 cards
    console.log(`[5] Selecting 3 cards from deck...`);
    if (deviceType === "desktop") {
      const cards = await page.$$(".perspective-1000 .origin-bottom");
      if (cards.length >= 3) {
        await cards[4].click();
        await new Promise((r) => setTimeout(r, 400));
        await cards[11].click();
        await new Promise((r) => setTimeout(r, 400));
        await cards[18].click();
        await new Promise((r) => setTimeout(r, 600));
      }
    } else {
      const mobileCards = await page.$$(".snap-mandatory .snap-center");
      if (mobileCards.length >= 3) {
        await mobileCards[1].click();
        await new Promise((r) => setTimeout(r, 400));
        await mobileCards[5].click();
        await new Promise((r) => setTimeout(r, 400));
        await mobileCards[9].click();
        await new Promise((r) => setTimeout(r, 600));
      }
    }

    // Deck Scene (Selected 3 cards)
    const s3SelectedPath = path.join(OUTPUT_DIR, `${deviceType}-03-deck-selected.png`);
    await page.screenshot({ path: s3SelectedPath, fullPage: false });
    console.log(`Saved: ${s3SelectedPath}`);

    // Click "Tiến hành Khai Mở"
    console.log(`[6] Entering Card Reveal Scene...`);
    await clickByText(page, "button", "Tiến hành Khai Mở");
    await new Promise((r) => setTimeout(r, 1500));

    // Reveal Scene (Card 1 revealed)
    const s4Card1Path = path.join(OUTPUT_DIR, `${deviceType}-04-reveal-card1.png`);
    await page.screenshot({ path: s4Card1Path, fullPage: false });
    console.log(`Saved: ${s4Card1Path}`);

    // Click "Lật tất cả" to quickly reveal all and proceed
    console.log(`[7] Revealing all cards...`);
    await clickByText(page, "button", "Lật tất cả");
    await new Promise((r) => setTimeout(r, 1500));

    // Click "Xem diễn giải chi tiết" if present
    try {
      await clickByText(page, "button", "Xem diễn giải chi tiết");
      await new Promise((r) => setTimeout(r, 1200));
    } catch (e) {
      // Might auto navigate
    }

    await new Promise((r) => setTimeout(r, 1200));

    // 5. Reading Scene (The Revelation)
    console.log(`[8] Capturing Reading Scene (The Revelation)...`);
    const s5TopPath = path.join(OUTPUT_DIR, `${deviceType}-05-reading-top.png`);
    await page.screenshot({ path: s5TopPath, fullPage: false });
    console.log(`Saved: ${s5TopPath}`);

    // Full page screenshot of Reading scene
    const s5FullPath = path.join(OUTPUT_DIR, `${deviceType}-05-reading-full.png`);
    await page.screenshot({ path: s5FullPath, fullPage: true });
    console.log(`Saved: ${s5FullPath}`);

    // Test accordion expansion in Rulebase
    try {
      await clickByText(page, "button", "Chi tiết biểu tượng & triết lý");
      await new Promise((r) => setTimeout(r, 400));
      const s5ExpPath = path.join(OUTPUT_DIR, `${deviceType}-05-reading-expanded.png`);
      await page.screenshot({ path: s5ExpPath, fullPage: false });
      console.log(`Saved: ${s5ExpPath}`);
    } catch (e) {
      console.log("Accordion button not clicked or already expanded");
    }

    // Save reading and open History modal
    console.log(`[9] Testing Save & History Modal...`);
    try {
      await clickByText(page, "button", "Lưu trải bài");
      await new Promise((r) => setTimeout(r, 400));
    } catch (e) {}

    try {
      await clickByText(page, "button", "Lịch sử");
      await new Promise((r) => setTimeout(r, 600));
      const s6HistPath = path.join(OUTPUT_DIR, `${deviceType}-06-history-modal.png`);
      await page.screenshot({ path: s6HistPath, fullPage: false });
      console.log(`Saved: ${s6HistPath}`);
    } catch (e) {}

    console.log(`Successfully completed all captures for ${deviceType}!`);
  } catch (err) {
    console.error(`Error capturing ${deviceType}:`, err);
    const errPath = path.join(OUTPUT_DIR, `${deviceType}-error.png`);
    await page.screenshot({ path: errPath, fullPage: true });
    console.log(`Error screenshot saved to: ${errPath}`);
  } finally {
    await browser.close();
  }
}

async function run() {
  await captureDevice("desktop", {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
  });

  await captureDevice("mobile", {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });

  console.log("\nAll visual QA captures completed successfully!");
}

run();
