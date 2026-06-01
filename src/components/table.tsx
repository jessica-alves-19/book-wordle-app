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
    <div className="mx-auto mt-8 w-full max-w-4xl rounded-[32px] border border-blue-300/10 bg-[#081423]/90 p-5 shadow-2xl backdrop-blur-xl">
      <div className="flex gap-6">
        {guesses.map((guess, index) => (
          <div key={index}>
            <span
              className={
                guess.isTitleCorrect
                  ? "!bg-[#d4ffd4] !text-black"
                  : "!bg-[#ffd4d4] !text-black"
              }
              style={{
                marginRight: "5px",
                padding: "2px 6px",
                borderRadius: "3px",
                display: "inline-block",
              }}
            >
              {guess.book.title}
            </span>
            <span
              className={
                guess.isAuthorCorrect
                  ? "!bg-[#d4ffd4] !text-black"
                  : "!bg-[#ffd4d4] !text-black"
              }
              style={{
                marginRight: "5px",
                padding: "2px 6px",
                borderRadius: "3px",
                display: "inline-block",
              }}
            >
              {guess.book.authors[0]}
            </span>
            <span
              className={
                guess.isYearCorrect
                  ? "!bg-[#d4ffd4] !text-black"
                  : "!bg-[#ffd4d4] !text-black"
              }
              style={{
                marginRight: "5px",
                padding: "2px 6px",
                borderRadius: "3px",
                display: "inline-block",
              }}
            >
              {guess.book.publishedYear}
            </span>
            <div>
              {guess.genreMatches.map((match, idx) => (
                <span
                  key={idx}
                  className={
                    match.isCorrect
                      ? "!bg-[#d4ffd4] !text-black"
                      : "!bg-[#ffd4d4] !text-black"
                  }
                  style={{
                    marginRight: "5px",
                    padding: "2px 6px",
                    borderRadius: "3px",
                    display: "inline-block",
                  }}
                >
                  {match.genre}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default GuessTable;
