import { useState } from "react";
import "./App.css";
import type { Book } from "./utils/types";
import GuessTable from "./components/table";
import GuessSearchInput from "./components/inputSearch";
import books from "./data/books.json";

type GuessRecord = {
  book: Book;
  isTitleCorrect: boolean;
  isYearCorrect: boolean;
  isAuthorCorrect: boolean;
  isGenreCorrect: boolean;
  genreMatches: { genre: string; isCorrect: boolean }[];
};

function App() {
  const allBooks: Book[] = books as Book[];
  const [guess, setGuess] = useState("");
  const [guesses, setGuesses] = useState<GuessRecord[]>([]);

  const curentBookGuess: Book[] = allBooks.filter((g) => g.title === guess);

  function getRndInteger(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  const [correctBook] = useState<Book | undefined>(() => {
    return allBooks[getRndInteger(0, allBooks.length - 1)];
  });

  function handleGuessSubmit() {
    if (curentBookGuess.length === 0) {
      alert("Book not found. Please enter a valid title.");
      return;
    }

    const selectedBook = curentBookGuess[0];
    const isTitleCorrect = selectedBook.title === correctBook?.title;
    const isYearCorrect =
      selectedBook.publishedYear === correctBook?.publishedYear;
    const isAuthorCorrect = selectedBook.authors[0] === correctBook?.authors[0];

    // Check if all genres are present in correct book
    const correctGenres = new Set(correctBook?.categories || []);
    const genreMatches = selectedBook.categories.map((g) => ({
      genre: g,
      isCorrect: correctGenres.has(g),
    }));

    const isGenreCorrect = genreMatches.every((g) => g.isCorrect);

    const isCompletelyCorrect =
      isTitleCorrect && isYearCorrect && isAuthorCorrect && isGenreCorrect;

    if (isCompletelyCorrect) {
      alert("🎉 Correct! You got it!");
      window.location.reload();
    }

    setGuesses((prev) => [
      ...prev,
      {
        book: selectedBook,
        isTitleCorrect,
        isYearCorrect,
        isAuthorCorrect,
        isGenreCorrect,
        genreMatches,
      },
    ]);
    setGuess("");
  }

  return (
    <div className="relative z-10 mx-auto max-w-5xl px-6 py-10">
      <GuessSearchInput
        guess={guess}
        setGuess={setGuess}
        onSubmit={handleGuessSubmit}
        allBooks={allBooks}
      />

      <GuessTable guesses={guesses} />
    </div>
  );
}

export default App;
