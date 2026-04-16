import type { Book } from "../utils/types";

interface GuessTableProps {
  guesses: {
    book: Book;
    isTitleCorrect: boolean;
    isYearCorrect: boolean;
    isAuthorCorrect: boolean;
    isGenreCorrect: boolean;
    genreMatches: { genre: string; isCorrect: boolean }[];
  }[];
}

function GuessTable({ guesses }: GuessTableProps) {
  return (
    <table className="table">
      <thead>
        <tr>
          <th>Book</th>
          <th>Author</th>
          <th>Publications Date</th>
          <th>Genres</th>
        </tr>
      </thead>
      <tbody>
        {guesses.map((guess, index) => (
          <tr key={`${guess.book.title}-${index}`}>
            <td
              className={guess.isTitleCorrect ? "correct-bg" : "incorrect-bg"}
            >
              {guess.book.title}
            </td>
            <td
              className={
                guess.isAuthorCorrect ? "correct-bg" : "incorrect-bg"
              }
            >
              {guess.book.author}
            </td>
            <td
              className={guess.isYearCorrect ? "correct-bg" : "incorrect-bg"}
            >
              {guess.book.publication_year}
            </td>
            <td className="genre-cell">
              {guess.genreMatches.map((match, idx) => (
                <span
                  key={idx}
                  className={
                    match.isCorrect ? "correct-bg" : "incorrect-bg"
                  }
                  style={{ marginRight: "5px", padding: "2px 6px", borderRadius: "3px", display: "inline-block" }}
                >
                  {match.genre}
                </span>
              ))}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default GuessTable;
