import fs from "node:fs/promises";

const API_URL = "https://openlibrary.org/search.json";

const MIN_YEAR = 2014;
const MAX_YEAR = 2026;

const CATEGORIES = [
  "fiction",
  "fantasy",
  "romance",
  "thriller",
  "mystery",
  "science fiction",
  "young adult",
  "horror",
  "adventure",
];

const HEADERS = {
  "User-Agent": "BookWordle/1.0 (jessica.p.f.alves@gmail.com.com)",
};

async function fetchBooks(category) {
  const query = `"${category}"`;

  const params = new URLSearchParams();

  params.set("q", query);
  params.set("page", "1");
  params.set("limit", "100");

  params.set(
    "fields",
    [
      "key",
      "title",
      "author_name",
      "first_publish_year",
      "cover_i",
      "edition_count",
      "ratings_count",
      "ratings_average",
      "readinglog_count",
      "subject",
    ].join(","),
  );

  const url = `${API_URL}?${params.toString()}`;

  console.log(`Fetching: ${url}`);

  const response = await fetch(url, {
    headers: HEADERS,
  });

  if (!response.ok) {
    throw new Error(
      `Open Library returned ${response.status}: ${response.statusText}`,
    );
  }

  const data = await response.json();

  return data.docs || [];
}

function calculatePopularity(book) {
  let score = 0;

  const ratings = book.ratings_count || 0;
  const readingLog = book.readinglog_count || 0;
  const editions = book.edition_count || 0;
  const rating = book.ratings_average || 0;

  // Ratings
  if (ratings >= 10000) {
    score += 10;
  } else if (ratings >= 5000) {
    score += 8;
  } else if (ratings >= 1000) {
    score += 6;
  } else if (ratings >= 500) {
    score += 4;
  } else if (ratings >= 100) {
    score += 2;
  }

  // Reading activity
  if (readingLog >= 10000) {
    score += 10;
  } else if (readingLog >= 5000) {
    score += 8;
  } else if (readingLog >= 1000) {
    score += 6;
  } else if (readingLog >= 500) {
    score += 4;
  } else if (readingLog >= 100) {
    score += 2;
  }

  // Editions
  if (editions >= 100) {
    score += 5;
  } else if (editions >= 50) {
    score += 4;
  } else if (editions >= 20) {
    score += 2;
  }

  // Rating
  if (rating >= 4.5) {
    score += 4;
  } else if (rating >= 4.2) {
    score += 3;
  } else if (rating >= 4) {
    score += 2;
  }

  // Cover
  if (book.cover_i) {
    score += 2;
  }

  return score;
}

function normalizeBook(book, category) {
  const year = book.first_publish_year;

  // Only 2014-2026
  if (!year || year < MIN_YEAR || year > MAX_YEAR) {
    return null;
  }

  // Must have title
  if (!book.title) {
    return null;
  }

  // Must have author
  if (!book.author_name?.length) {
    return null;
  }

  // Must have cover
  if (!book.cover_i) {
    return null;
  }

  const popularityScore = calculatePopularity(book);

  return {
    id: book.key,

    title: book.title,

    authors: book.author_name,

    publishedYear: year,

    cover: `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`,

    coverId: book.cover_i,

    editionCount: book.edition_count || 0,

    ratingsCount: book.ratings_count || 0,

    averageRating: book.ratings_average || null,

    readingLogCount: book.readinglog_count || 0,

    categories: [category],

    popularityScore,
  };
}

function removeDuplicates(books) {
  const map = new Map();

  for (const book of books) {
    if (!map.has(book.id)) {
      map.set(book.id, book);
    }
  }

  return [...map.values()];
}

async function run() {
  console.log("📚 Starting Open Library importer...\n");

  let books = [];

  for (const category of CATEGORIES) {
    console.log(`📖 Category: ${category}`);

    try {
      const results = await fetchBooks(category);

      console.log(`   → Received ${results.length} books`);

      const normalized = results
        .map((book) => normalizeBook(book, category))
        .filter(Boolean);

      console.log(`   → ${normalized.length} books passed year/data filters`);

      books.push(...normalized);

      // Wait 1 second between requests
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`❌ Failed: ${category}`);
      console.error(error.message);
    }
  }

  console.log("\n------------------------------");

  console.log(`📦 Total books: ${books.length}`);

  // Remove duplicates
  books = removeDuplicates(books);

  console.log(`🔄 After duplicates: ${books.length}`);

  // Sort by popularity
  books.sort((a, b) => b.popularityScore - a.popularityScore);

  // IMPORTANT:
  // Start with a low threshold so we don't accidentally
  // remove everything.
  books = books.filter((book) => book.popularityScore >= 2);

  console.log(`🔥 After popularity filter: ${books.length}`);

  // Maximum number of books
  books = books.slice(0, 5000);

  await fs.writeFile("books.json", JSON.stringify(books, null, 2), "utf8");

  console.log(`\n✅ Final books: ${books.length}`);
  console.log("💾 Saved to books.json");

  console.log("\n🏆 Top 20:");

  books.slice(0, 20).forEach((book, index) => {
    console.log(
      `${index + 1}. ${book.title} — ${book.authors.join(
        ", ",
      )} (${book.publishedYear}) | Score: ${book.popularityScore}`,
    );
  });
}

run().catch((error) => {
  console.error("❌ Import failed:");
  console.error(error);
});
