import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const targetDir = path.resolve(__dirname, "../public/tarot/cards");

// Ensure target directory exists
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// 78 Card ID to Wikimedia Commons filename mapping
const CARD_MAPPINGS = [
  // Major Arcana (22)
  { id: "major-00-fool", file: "File:RWS Tarot 00 Fool.jpg", name: "The Fool" },
  { id: "major-01-magician", file: "File:RWS Tarot 01 Magician.jpg", name: "The Magician" },
  { id: "major-02-high-priestess", file: "File:RWS Tarot 02 High Priestess.jpg", name: "The High Priestess" },
  { id: "major-03-empress", file: "File:RWS Tarot 03 Empress.jpg", name: "The Empress" },
  { id: "major-04-emperor", file: "File:RWS Tarot 04 Emperor.jpg", name: "The Emperor" },
  { id: "major-05-hierophant", file: "File:RWS Tarot 05 Hierophant.jpg", name: "The Hierophant" },
  { id: "major-06-lovers", file: "File:RWS Tarot 06 Lovers.jpg", name: "The Lovers" },
  { id: "major-07-chariot", file: "File:RWS Tarot 07 Chariot.jpg", name: "The Chariot" },
  { id: "major-08-strength", file: "File:RWS Tarot 08 Strength.jpg", name: "Strength" },
  { id: "major-09-hermit", file: "File:RWS Tarot 09 Hermit.jpg", name: "The Hermit" },
  { id: "major-10-wheel-of-fortune", file: "File:RWS Tarot 10 Wheel of Fortune.jpg", name: "Wheel of Fortune" },
  { id: "major-11-justice", file: "File:RWS Tarot 11 Justice.jpg", name: "Justice" },
  { id: "major-12-hanged-man", file: "File:RWS Tarot 12 Hanged Man.jpg", name: "The Hanged Man" },
  { id: "major-13-death", file: "File:RWS Tarot 13 Death.jpg", name: "Death" },
  { id: "major-14-temperance", file: "File:RWS Tarot 14 Temperance.jpg", name: "Temperance" },
  { id: "major-15-devil", file: "File:RWS Tarot 15 Devil.jpg", name: "The Devil" },
  { id: "major-16-tower", file: "File:RWS Tarot 16 Tower.jpg", name: "The Tower" },
  { id: "major-17-star", file: "File:RWS Tarot 17 Star.jpg", name: "The Star" },
  { id: "major-18-moon", file: "File:RWS Tarot 18 Moon.jpg", name: "The Moon" },
  { id: "major-19-sun", file: "File:RWS Tarot 19 Sun.jpg", name: "The Sun" },
  { id: "major-20-judgement", file: "File:RWS Tarot 20 Judgement.jpg", name: "Judgement" },
  { id: "major-21-world", file: "File:RWS Tarot 21 World.jpg", name: "The World" },

  // Wands (14)
  { id: "wands-01-ace", file: "File:Wands01.jpg", name: "Ace of Wands" },
  { id: "wands-02-two", file: "File:Wands02.jpg", name: "Two of Wands" },
  { id: "wands-03-three", file: "File:Wands03.jpg", name: "Three of Wands" },
  { id: "wands-04-four", file: "File:Wands04.jpg", name: "Four of Wands" },
  { id: "wands-05-five", file: "File:Wands05.jpg", name: "Five of Wands" },
  { id: "wands-06-six", file: "File:Wands06.jpg", name: "Six of Wands" },
  { id: "wands-07-seven", file: "File:Wands07.jpg", name: "Seven of Wands" },
  { id: "wands-08-eight", file: "File:Wands08.jpg", name: "Eight of Wands" },
  { id: "wands-09-nine", file: "File:Wands09.jpg", name: "Nine of Wands" },
  { id: "wands-10-ten", file: "File:Wands10.jpg", name: "Ten of Wands" },
  { id: "wands-11-page", file: "File:Wands11.jpg", name: "Page of Wands" },
  { id: "wands-12-knight", file: "File:Wands12.jpg", name: "Knight of Wands" },
  { id: "wands-13-queen", file: "File:Wands13.jpg", name: "Queen of Wands" },
  { id: "wands-14-king", file: "File:Wands14.jpg", name: "King of Wands" },

  // Cups (14)
  { id: "cups-01-ace", file: "File:Cups01.jpg", name: "Ace of Cups" },
  { id: "cups-02-two", file: "File:Cups02.jpg", name: "Two of Cups" },
  { id: "cups-03-three", file: "File:Cups03.jpg", name: "Three of Cups" },
  { id: "cups-04-four", file: "File:Cups04.jpg", name: "Four of Cups" },
  { id: "cups-05-five", file: "File:Cups05.jpg", name: "Five of Cups" },
  { id: "cups-06-six", file: "File:Cups06.jpg", name: "Six of Cups" },
  { id: "cups-07-seven", file: "File:Cups07.jpg", name: "Seven of Cups" },
  { id: "cups-08-eight", file: "File:Cups08.jpg", name: "Eight of Cups" },
  { id: "cups-09-nine", file: "File:Cups09.jpg", name: "Nine of Cups" },
  { id: "cups-10-ten", file: "File:Cups10.jpg", name: "Ten of Cups" },
  { id: "cups-11-page", file: "File:Cups11.jpg", name: "Page of Cups" },
  { id: "cups-12-knight", file: "File:Cups12.jpg", name: "Knight of Cups" },
  { id: "cups-13-queen", file: "File:Cups13.jpg", name: "Queen of Cups" },
  { id: "cups-14-king", file: "File:Cups14.jpg", name: "King of Cups" },

  // Swords (14)
  { id: "swords-01-ace", file: "File:Swords01.jpg", name: "Ace of Swords" },
  { id: "swords-02-two", file: "File:Swords02.jpg", name: "Two of Swords" },
  { id: "swords-03-three", file: "File:Swords03.jpg", name: "Three of Swords" },
  { id: "swords-04-four", file: "File:Swords04.jpg", name: "Four of Swords" },
  { id: "swords-05-five", file: "File:Swords05.jpg", name: "Five of Swords" },
  { id: "swords-06-six", file: "File:Swords06.jpg", name: "Six of Swords" },
  { id: "swords-07-seven", file: "File:Swords07.jpg", name: "Seven of Swords" },
  { id: "swords-08-eight", file: "File:Swords08.jpg", name: "Eight of Swords" },
  { id: "swords-09-nine", file: "File:Swords09.jpg", name: "Nine of Swords" },
  { id: "swords-10-ten", file: "File:Swords10.jpg", name: "Ten of Swords" },
  { id: "swords-11-page", file: "File:Swords11.jpg", name: "Page of Swords" },
  { id: "swords-12-knight", file: "File:Swords12.jpg", name: "Knight of Swords" },
  { id: "swords-13-queen", file: "File:Swords13.jpg", name: "Queen of Swords" },
  { id: "swords-14-king", file: "File:Swords14.jpg", name: "King of Swords" },

  // Pentacles (14)
  { id: "pentacles-01-ace", file: "File:Pents01.jpg", name: "Ace of Pentacles" },
  { id: "pentacles-02-two", file: "File:Pents02.jpg", name: "Two of Pentacles" },
  { id: "pentacles-03-three", file: "File:Pents03.jpg", name: "Three of Pentacles" },
  { id: "pentacles-04-four", file: "File:Pents04.jpg", name: "Four of Pentacles" },
  { id: "pentacles-05-five", file: "File:Pents05.jpg", name: "Five of Pentacles" },
  { id: "pentacles-06-six", file: "File:Pents06.jpg", name: "Six of Pentacles" },
  { id: "pentacles-07-seven", file: "File:Pents07.jpg", name: "Seven of Pentacles" },
  { id: "pentacles-08-eight", file: "File:Pents08.jpg", name: "Eight of Pentacles" },
  { id: "pentacles-09-nine", file: "File:Pents09.jpg", name: "Nine of Pentacles" },
  { id: "pentacles-10-ten", file: "File:Pents10.jpg", name: "Ten of Pentacles" },
  { id: "pentacles-11-page", file: "File:Pents11.jpg", name: "Page of Pentacles" },
  { id: "pentacles-12-knight", file: "File:Pents12.jpg", name: "Knight of Pentacles" },
  { id: "pentacles-13-queen", file: "File:Pents13.jpg", name: "Queen of Pentacles" },
  { id: "pentacles-14-king", file: "File:Pents14.jpg", name: "King of Pentacles" },
];

const USER_AGENT = "ArcanaTarotBot/2.0 (https://github.com/arcana-tarot; contact: dev@arcana.app)";

async function fetchImageUrlsInBatches(mappings, batchSize = 35) {
  const fileToUrlMap = new Map();

  for (let i = 0; i < mappings.length; i += batchSize) {
    const batch = mappings.slice(i, i + batchSize);
    const titlesParam = batch.map((m) => encodeURIComponent(m.file)).join("|");
    const apiUrl = `https://commons.wikimedia.org/w/api.php?action=query&titles=${titlesParam}&prop=imageinfo&iiprop=url|size|mime&iiurlwidth=600&format=json`;

    console.log(`[Wikimedia API] Fetching batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(mappings.length / batchSize)}...`);
    const res = await fetch(apiUrl, { headers: { "User-Agent": USER_AGENT } });
    if (!res.ok) {
      throw new Error(`Wikimedia API responded with HTTP ${res.status}`);
    }

    const data = await res.json();
    const pages = data.query?.pages || {};

    for (const pageId in pages) {
      const page = pages[pageId];
      if (page.imageinfo && page.imageinfo[0]) {
        const info = page.imageinfo[0];
        // Use thumburl (600px width ~ 1000px height) or fallback to full url
        const downloadUrl = info.thumburl || info.url;
        fileToUrlMap.set(page.title, {
          url: downloadUrl,
          originalUrl: info.url,
          width: info.thumbwidth || info.width,
          height: info.thumbheight || info.height,
          size: info.size,
          descriptionUrl: info.descriptionurl,
        });
      }
    }

    // Gentle 300ms pause between Wikimedia API batches
    await new Promise((r) => setTimeout(r, 300));
  }

  return fileToUrlMap;
}

async function downloadFile(url, destPath) {
  const res = await fetch(url, { headers: { "User-Agent": USER_AGENT } });
  if (!res.ok) {
    throw new Error(`Failed to download ${url}: HTTP ${res.status}`);
  }
  const buffer = await res.arrayBuffer();
  fs.writeFileSync(destPath, Buffer.from(buffer));
}

async function main() {
  console.log(`====================================================`);
  console.log(`ARCANA 2.0: Authentic Rider-Waite-Smith Asset Pipeline`);
  console.log(`====================================================`);
  console.log(`Total cards to process: ${CARD_MAPPINGS.length}`);

  // Step 1: Query image URLs from Wikimedia Commons
  const fileToUrlMap = await fetchImageUrlsInBatches(CARD_MAPPINGS);
  console.log(`Successfully resolved ${fileToUrlMap.size}/${CARD_MAPPINGS.length} Wikimedia file records.\n`);

  const manifest = {
    deck: "Rider-Waite-Smith Tarot Deck (1909)",
    artist: "Pamela Colman Smith",
    author: "Arthur Edward Waite",
    license: "Public Domain (first published in 1909)",
    source: "Wikimedia Commons (TaionWC High-Resolution Collection)",
    downloadedAt: new Date().toISOString(),
    cardCount: CARD_MAPPINGS.length,
    cards: {},
  };

  let downloadedCount = 0;
  let skippedCount = 0;

  for (const mapping of CARD_MAPPINGS) {
    const info = fileToUrlMap.get(mapping.file);
    if (!info) {
      console.error(`[ERROR] No image info found for ${mapping.file} (${mapping.id})`);
      continue;
    }

    const filename = `${mapping.id}.jpg`;
    const destPath = path.join(targetDir, filename);

    // If file already exists and is > 10KB, skip re-download
    if (fs.existsSync(destPath) && fs.statSync(destPath).size > 10240) {
      skippedCount++;
    } else {
      console.log(`[Downloading ${downloadedCount + 1}] ${mapping.name} (${mapping.id}) -> ${filename}`);
      try {
        await downloadFile(info.url, destPath);
        downloadedCount++;
        // 100ms throttle between downloads to respect Wikimedia Commons
        await new Promise((r) => setTimeout(r, 100));
      } catch (err) {
        console.error(`[Download Error] ${mapping.id}: ${err.message}. Retrying with original URL...`);
        await downloadFile(info.originalUrl, destPath);
        downloadedCount++;
      }
    }

    manifest.cards[mapping.id] = {
      id: mapping.id,
      name: mapping.name,
      localPath: `/tarot/cards/${filename}`,
      originalSourceUrl: info.descriptionUrl,
      width: info.width,
      height: info.height,
    };
  }

  // Write Manifest
  const manifestPath = path.resolve(__dirname, "../public/tarot/manifest.json");
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

  console.log(`\n====================================================`);
  console.log(`DOWNLOAD COMPLETE!`);
  console.log(`Downloaded: ${downloadedCount}, Existing: ${skippedCount}, Total: ${Object.keys(manifest.cards).length}/78`);
  console.log(`Asset directory: ${targetDir}`);
  console.log(`Manifest written to: ${manifestPath}`);
  console.log(`====================================================`);
}

main().catch((err) => {
  console.error("Fatal Error in asset pipeline:", err);
  process.exit(1);
});

