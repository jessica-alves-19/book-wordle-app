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
    <>
      <form onSubmit={search}>
        <input
          className="search-input"
          name="guess"
          list="books"
          defaultValue="Write Book Name"
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
    </>
  );
}

export default GuessSearchInput;
