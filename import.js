import dotenv from "dotenv";
dotenv.config();

import axios from "axios";
import fs from "fs";
import pLimit from "p-limit";

const API_KEY = process.env.GOOGLE_BOOKS_API_KEY;

// Genres to build your dataset (expand as needed)
const GENRES = [
  "fiction",
  "fantasy",
  "romance",
  "science fiction",
  "thriller",
  "mystery",
  "historical fiction",
  "nonfiction",
  "young adult",
];

// Limit concurrency so we don’t hit API rate limits
const limit = pLimit(3);

// Store results
let books = [];

/**
 * Fetch books from Google Books API
 */
async function fetchBooksByGenre(genre, startIndex = 0) {
  const url = "https://www.googleapis.com/books/v1/volumes";

  const res = await axios.get(url, {
    params: {
      q: `subject:${genre}`,
      startIndex,
      maxResults: 10,
      key: API_KEY,
    },
  });

  console.log("RAW RESPONSE:", res.data);

  return res.data.items || [];
}

/**
 * Normalize Google Books response into clean format
 */
function normalizeBook(item) {
  const info = item.volumeInfo;

  if (!info || !info.title || !info.authors) return null;

  return {
    id: item.id,
    title: info.title,
    authors: info.authors,
    publishedYear: info.publishedDate
      ? parseInt(info.publishedDate.slice(0, 4))
      : null,
    categories: info.categories || [],
    pageCount: info.pageCount || null,
    language: info.language || null,
    thumbnail: info.imageLinks?.thumbnail || null,
    previewLink: info.previewLink || null,
  };
}

/**
 * Clean invalid books
 */
function isValidBook(book) {
  return (
    book &&
    book.title &&
    book.authors &&
    book.authors.length > 0 &&
    book.thumbnail &&
    book.publishedYear
  );
}

/**
 * Deduplicate books
 */
function deduplicate(list) {
  const seen = new Set();
  return list.filter((b) => {
    const key = b.title.toLowerCase() + b.authors[0].toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/**
 * Get books from recent years
 */
function isInYearRange(book) {
  return (
    book.publishedYear &&
    book.publishedYear >= 2020 &&
    book.publishedYear <= new Date().getFullYear()
  );
}

/**
 * Fetch one genre fully (multiple pages)
 */
async function fetchGenre(genre) {
  console.log(`📚 Fetching genre: ${genre}`);

  let all = [];

  for (let i = 0; i < 120; i += 40) {
    try {
      const items = await fetchBooksByGenre(genre, i);

      const normalized = items.map(normalizeBook).filter(isValidBook);

      all.push(...normalized);

      console.log(`   ↳ ${genre} | batch ${i} → ${normalized.length} books`);
    } catch (err) {
      console.log(`❌ Error on ${genre} index ${i}`);
    }
  }

  return all;
}

/**
 * Main importer
 */
async function run() {
  console.log("🚀 Starting Google Books import...\n");

  const tasks = GENRES.map((g) => limit(() => fetchGenre(g)));

  const results = await Promise.all(tasks);

  books = results.flat();

  console.log(`\n📦 Raw books: ${books.length}`);

  books = books.filter(isInYearRange);

  console.log(`✨ After year filter: ${books.length}`);

  books = deduplicate(books);

  console.log(`✨ After dedupe: ${books.length}`);

  fs.writeFileSync("books.json", JSON.stringify(books, null, 2));

  console.log("\n✅ Saved to books.json");
}

run();
