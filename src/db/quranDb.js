import initSqlJs from 'sql.js';
import wasmUrl from 'sql.js/dist/sql-wasm.wasm?url';
import { unzipSync } from 'fflate';
import { get as idbGet, set as idbSet } from 'idb-keyval';

// Relative URLs so in production (app served from https://mero2online.com/quran/)
// these resolve to https://mero2online.com/HQD/... same-origin, and in dev they
// hit the Vite proxy configured in vite.config.js -> server.proxy['/HQD'].
const DB_BASE = '/HQD';
const QURAN_ZIP = `${DB_BASE}/q_verses.zip`;
const AYAHINFO_ZIP = `${DB_BASE}/ayahinfo_large.zip`;
const QURAN_DB_FILE = 'quran_ar.db';
const AYAHINFO_DB_FILE = 'ayahinfo_large.db';
const QURAN_CACHE_KEY = 'quran_ar.db.bytes';
const AYAHINFO_CACHE_KEY = 'ayahinfo_large.db.bytes';

let sqlPromise = null;
let loadPromise = null;
let quranDb = null;
let ayahInfoDb = null;
let versesIndex = null; // [{ sura, ayah, plain, display, normalized }]
let ayahToPageMap = null; // Map<`${sura}:${ayah}`, pageNo>
// Image width in the glyph DB's coordinate space. Mushaf Madinah has symmetric
// horizontal margins, so image_w_in_glyph_space ≈ MAX(max_x) + MIN(min_x).
let glyphImageWidth = null;

export const normalizeArabic = (text) => {
  if (!text) return '';
  return text
    .replace(/[أإآ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه')
    .replace(/[\u064B-\u065F]/g, '')
    .replace(/ـ/g, '');
};

const getSql = () => {
  if (!sqlPromise) {
    sqlPromise = initSqlJs({ locateFile: () => wasmUrl });
  }
  return sqlPromise;
};

const fetchAndCacheDb = async (cacheKey, zipUrl, innerFileName) => {
  const cached = await idbGet(cacheKey);
  if (cached instanceof Uint8Array) return cached;

  const res = await fetch(zipUrl);
  if (!res.ok) {
    throw new Error(`Failed to download ${zipUrl}: ${res.status}`);
  }
  const zipBuf = new Uint8Array(await res.arrayBuffer());
  const unzipped = unzipSync(zipBuf);

  let dbBytes = unzipped[innerFileName];
  if (!dbBytes) {
    // Fallback: take the first .db file inside the zip.
    const key = Object.keys(unzipped).find((k) => /\.db$/i.test(k));
    if (key) dbBytes = unzipped[key];
  }
  if (!dbBytes) {
    throw new Error(`No .db file found inside ${zipUrl}`);
  }

  await idbSet(cacheKey, dbBytes);
  return dbBytes;
};

const buildVersesIndex = () => {
  if (!quranDb) return;
  const stmt = quranDb.prepare(
    `SELECT v.sura AS sura, v.ayah AS ayah, v.text AS plain, a.text AS arabic
     FROM verses v
     LEFT JOIN arabic_text a ON v.sura = a.sura AND v.ayah = a.ayah`
  );
  const out = [];
  while (stmt.step()) {
    const row = stmt.getAsObject();
    const plain = row.plain || '';
    const display = row.arabic || plain;
    out.push({
      sura: row.sura,
      ayah: row.ayah,
      plain,
      display,
      normalized: normalizeArabic(plain),
    });
  }
  stmt.free();
  versesIndex = out;
};

const buildAyahPageMap = () => {
  if (!ayahInfoDb) return;
  const stmt = ayahInfoDb.prepare(
    `SELECT sura_number AS sura, ayah_number AS ayah, MIN(page_number) AS page
     FROM glyphs GROUP BY sura_number, ayah_number`
  );
  const map = new Map();
  while (stmt.step()) {
    const row = stmt.getAsObject();
    map.set(`${row.sura}:${row.ayah}`, row.page);
  }
  stmt.free();
  ayahToPageMap = map;
};

const computeGlyphImageWidth = () => {
  if (!ayahInfoDb) return;
  const stmt = ayahInfoDb.prepare(
    `SELECT MAX(max_x) AS maxX, MIN(min_x) AS minX FROM glyphs`
  );
  if (stmt.step()) {
    const row = stmt.getAsObject();
    if (row.maxX && row.minX != null) {
      // Symmetric horizontal margins: total image width ≈ right text edge + left margin.
      glyphImageWidth = row.maxX + row.minX;
    }
  }
  stmt.free();
};

export const getGlyphImageWidth = () => glyphImageWidth;

export const loadDatabases = () => {
  if (loadPromise) return loadPromise;
  loadPromise = (async () => {
    const SQL = await getSql();

    const [quranBytes, ayahInfoBytes] = await Promise.all([
      fetchAndCacheDb(QURAN_CACHE_KEY, QURAN_ZIP, QURAN_DB_FILE),
      fetchAndCacheDb(AYAHINFO_CACHE_KEY, AYAHINFO_ZIP, AYAHINFO_DB_FILE),
    ]);

    quranDb = new SQL.Database(quranBytes);
    ayahInfoDb = new SQL.Database(ayahInfoBytes);

    buildVersesIndex();
    buildAyahPageMap();
    computeGlyphImageWidth();
  })().catch((err) => {
    loadPromise = null;
    throw err;
  });
  return loadPromise;
};

export const searchQuran = (query, limit = 50) => {
  if (!versesIndex || !ayahToPageMap) return [];
  const q = normalizeArabic(String(query || '').trim());
  if (!q) return [];

  const hits = [];
  for (const v of versesIndex) {
    const idx = v.normalized.indexOf(q);
    if (idx === -1) continue;
    const pageNumber = ayahToPageMap.get(`${v.sura}:${v.ayah}`) || null;
    hits.push({
      sura: v.sura,
      ayah: v.ayah,
      text: v.display,
      plain: v.plain,
      normalized: v.normalized,
      matchIndex: idx,
      matchLength: q.length,
      pageNumber,
    });
    if (hits.length >= limit) break;
  }
  return hits;
};

export const getAyahGlyphs = (pageNumber, sura, ayah) => {
  if (!ayahInfoDb) return [];
  const stmt = ayahInfoDb.prepare(
    `SELECT min_x, max_x, min_y, max_y, line_number, position
     FROM glyphs
     WHERE page_number = ? AND sura_number = ? AND ayah_number = ?
     ORDER BY line_number, position`
  );
  stmt.bind([pageNumber, sura, ayah]);
  const out = [];
  while (stmt.step()) out.push(stmt.getAsObject());
  stmt.free();
  return out;
};

export const getPageRefSize = (pageNumber) => {
  if (!ayahInfoDb) return null;
  const stmt = ayahInfoDb.prepare(
    `SELECT MAX(max_x) AS refW, MAX(max_y) AS refH
     FROM glyphs WHERE page_number = ?`
  );
  stmt.bind([pageNumber]);
  let result = null;
  if (stmt.step()) {
    const row = stmt.getAsObject();
    if (row.refW && row.refH) {
      result = { refW: row.refW, refH: row.refH };
    }
  }
  stmt.free();
  return result;
};
