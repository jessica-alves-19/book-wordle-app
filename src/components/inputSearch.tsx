import { useEffect, useState } from "react";
import type { Book } from "../utils/types";

interface GuessSearchInputProps {
  guess: string;
  setGuess: React.Dispatch<React.SetStateAction<string>>;
  onSubmit: (e: React.FormEvent<HTMLFormElement>, guessValue: string) => void;
  allBooks: Book[];
}

function GuessSearchInput({
  guess,
  setGuess,
  onSubmit,
  allBooks,
}: GuessSearchInputProps) {
  const [inputValue, setInputValue] = useState(guess);

  useEffect(() => {
    setInputValue(guess);
  }, [guess]);

  useEffect(() => {
    const debounce = window.setTimeout(() => {
      setGuess(inputValue);
    }, 300);

    return () => {
      window.clearTimeout(debounce);
    };
  }, [inputValue, setGuess]);

  const matchedBooks = allBooks.filter((book) =>
    book.title.toLowerCase().includes(inputValue.toLowerCase().trim()),
  );
  const [showSuggestions, setShowSuggestions] = useState(false);

  function handleSelectSuggestion(title: string) {
    setInputValue(title);
    setGuess(title);
    setShowSuggestions(false);
  }

  function search(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setGuess(inputValue);
    onSubmit(e, inputValue);
  }

  return (
    <div className="relative">
      <div className="flex items-center rounded-3xl border border-blue-400/20 bg-[#09182b]/80 px-6 py-5 backdrop-blur-xl">
        <form onSubmit={search} className="flex w-full items-center gap-4">
          <input
            className="flex-1 bg-transparent text-xl outline-none placeholder:text-blue-100/30"
            name="guess"
            placeholder="Write Book Name"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => {
              window.setTimeout(() => setShowSuggestions(false), 100);
            }}
          />
          <button type="submit">Search</button>
        </form>
      </div>
      {showSuggestions && inputValue.trim().length > 0 && matchedBooks.length > 0 && (
        <ul className="absolute left-0 right-0 z-20 mt-1 max-h-72 overflow-y-auto rounded-3xl border border-blue-400/20 bg-[#09182b]/95 p-2 shadow-2xl backdrop-blur-xl">
          {matchedBooks.map((book) => (
            <li key={book.id} className="mb-2 last:mb-0">
              <button
                type="button"
                onMouseDown={() => handleSelectSuggestion(book.title)}
                className="flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-left transition hover:bg-blue-500/10"
              >
                <img
                  src={book.thumbnail}
                  alt={book.title}
                  className="h-14 w-10 flex-shrink-0 rounded-lg object-cover"
                />
                <div className="overflow-hidden">
                  <p className="truncate text-sm font-semibold text-white">
                    {book.title}
                  </p>
                  <p className="text-xs text-blue-100/70">
                    {book.authors[0]}
                  </p>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default GuessSearchInput;
