import { useState, useEffect } from "react";
import "./App.css";
import type { Book } from "./utils/types";
import GuessSearchInput from "./components/inputSearch";
import GuessCard from "./components/guessCard";

import ResultModal from "./components/resultModal";
import { useBooks } from "./hooks/useBooks";

type GuessRecord = {
  book: Book;
  isTitleCorrect: boolean;
  isYearCorrect: boolean;
  isCorrectYearMoreRecent: boolean;
  isAuthorCorrect: boolean;
  isGenreCorrect: boolean;
  genreMatches: { genre: string; isCorrect: boolean }[];
};

type ResultModalState = {
  isOpen: boolean;
  title: string;
  message: string;
  book?: Book;
  onConfirm?: () => void;
  confirmLabel?: string;
};

function App() {
  const { books: allBooks, loading } = useBooks();
  const [guess, setGuess] = useState<string>("");
  const [guesses, setGuesses] = useState<GuessRecord[]>([]);
  const [resultModal, setResultModal] = useState<ResultModalState>({
    isOpen: false,
    title: "",
    message: "",
  });

  const [correctBook, setCorrectBook] = useState<Book | undefined>(undefined);

  const pickRandomBook = ((): (() => Book | undefined) => {
    return () => {
      if (allBooks.length === 0) return undefined;
      return allBooks[Math.floor(Math.random() * allBooks.length)];
    };
  })();

  useEffect(() => {
    if (allBooks.length === 0) return;
    if (correctBook) return;
    const t = setTimeout(() => setCorrectBook(pickRandomBook()), 0);
    return () => clearTimeout(t);
  }, [allBooks, correctBook, pickRandomBook]);

  function openResultModal(
    title: string,
    message: string,
    book?: Book,
    onConfirm?: () => void,
    confirmLabel = "Play again",
  ) {
    setResultModal({
      isOpen: true,
      title,
      message,
      book,
      onConfirm,
      confirmLabel,
    });
  }

  function closeResultModal() {
    setResultModal((prev) => ({ ...prev, isOpen: false }));
  }

  function handleGuessSubmit(
    _e: React.FormEvent<HTMLFormElement>,
    guessValue: string,
  ) {
    const currentBookGuess = allBooks.filter((g) => g.title === guessValue);

    if (currentBookGuess.length === 0) {
      alert("Book not found. Please enter a valid title.");
      return;
    }

    const selectedBook = currentBookGuess[0];
    const isTitleCorrect = selectedBook.title === correctBook?.title;
    const isYearCorrect =
      selectedBook.publishedYear === correctBook?.publishedYear;
    const isAuthorCorrect = selectedBook.authors[0] === correctBook?.authors[0];
    const isCorrectYearMoreRecent =
      selectedBook.publishedYear > (correctBook?.publishedYear || 0);

    // Check if all genres are present in correct book
    const correctGenres = new Set(correctBook?.categories || []);
    const genreMatches = selectedBook.categories.map((g) => ({
      genre: g,
      isCorrect: correctGenres.has(g),
    }));

    const isGenreCorrect = genreMatches.every((g) => g.isCorrect);

    const isCompletelyCorrect =
      isTitleCorrect && isYearCorrect && isAuthorCorrect && isGenreCorrect;

    const guessRecord: GuessRecord = {
      book: selectedBook,
      isTitleCorrect,
      isYearCorrect,
      isCorrectYearMoreRecent,
      isAuthorCorrect,
      isGenreCorrect,
      genreMatches,
    };

    const nextGuessCount = guesses.length + 1;

    setGuesses((prev) => [guessRecord, ...prev]);

    if (isCompletelyCorrect) {
      openResultModal(
        "🎉 Correct!",
        "You guessed the right book.",
        correctBook,
        () => {
          setGuesses([]);
          setGuess("");
          setCorrectBook(pickRandomBook());
        },
      );
      setGuess("");
      return;
    }

    if (nextGuessCount >= 10) {
      openResultModal(
        "Game over",
        "You used all 10 guesses. The correct book was:",
        correctBook,
        () => {
          setGuesses([]);
          setGuess("");
          setCorrectBook(pickRandomBook());
        },
      );
    }

    setGuess("");
  }

  const guessCount = Math.min(guesses.length, 10);

  return (
    <div className="relative z-10 mx-auto max-w-5xl px-6 py-10">
      <div className="mb-6 rounded-[32px] border border-blue-400/20 bg-[#09182b]/80 px-5 py-4 text-center text-sm text-blue-100 shadow-inner backdrop-blur-xl">
        <span className="font-semibold text-white">Guesses:</span> {guessCount}{" "}
        / 10
      </div>
      {loading ? (
        <div className="mb-6 rounded-[24px] border border-blue-400/20 bg-[#09182b]/70 px-4 py-3 text-center text-sm text-blue-100 backdrop-blur-xl">
          Loading books...
        </div>
      ) : (
        <GuessSearchInput
          guess={guess}
          setGuess={setGuess}
          onSubmit={handleGuessSubmit}
          allBooks={allBooks}
        />
      )}
      <GuessCard
        guesses={guesses}
        correctedYearGuess={correctBook?.publishedYear || 0}
      />
      <ResultModal
        isOpen={resultModal.isOpen}
        title={resultModal.title}
        message={resultModal.message}
        book={resultModal.book}
        onClose={closeResultModal}
        onConfirm={resultModal.onConfirm}
        confirmLabel={resultModal.confirmLabel}
      />
    </div>
  );
}

export default App;
