import { useState } from "react";
import "./App.css";
import { ALL_BOOKS } from "./utils/constants";
import type { Book } from "./utils/types";
import GuessTable from "./components/table";
import GuessSearchInput from "./components/inputSearch";

type GuessRecord = {
  book: Book;
  isTitleCorrect: boolean;
  isYearCorrect: boolean;
  isAuthorCorrect: boolean;
  isGenreCorrect: boolean;
  genreMatches: { genre: string; isCorrect: boolean }[];
};

function App() {
  const allBooks: Book[] = ALL_BOOKS;
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
      selectedBook.publication_year === correctBook?.publication_year;
    const isAuthorCorrect = selectedBook.author === correctBook?.author;

    // Check if all genres are present in correct book
    const correctGenres = new Set(correctBook?.genre || []);
    const genreMatches = selectedBook.genre.map((g) => ({
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
    <>
      <div className="App">
        <GuessSearchInput
          guess={guess}
          setGuess={setGuess}
          onSubmit={handleGuessSubmit}
          allBooks={allBooks}
        />

        <GuessTable guesses={guesses} />
      </div>
    </>
  );
}

export default App;
