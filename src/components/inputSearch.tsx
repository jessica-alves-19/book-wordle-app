import type { Book } from "../utils/types";

interface GuessSearchInputProps {
  guess: string;
  setGuess: React.Dispatch<React.SetStateAction<string>>;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  allBooks: Book[];
}

function GuessSearchInput({
  guess,
  setGuess,
  onSubmit,
  allBooks,
}: GuessSearchInputProps) {
  function search(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    onSubmit(e);
  }

  return (
    <div className="flex items-center rounded-3xl border border-blue-400/20 bg-[#09182b]/80 px-6 py-5 backdrop-blur-xl">
      <form onSubmit={search} className="flex w-full items-center gap-4">
        <input
          className="flex-1 bg-transparent text-xl outline-none placeholder:text-blue-100/30"
          name="guess"
          list="books"
          placeholder="Write Book Name"
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>
      <datalist id="books">
        {allBooks.map((book) => (
          <option key={book.title} value={book.title}></option>
        ))}
      </datalist>
    </div>
  );
}

export default GuessSearchInput;
