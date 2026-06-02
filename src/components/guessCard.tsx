import type { Book } from "../utils/types";
import GuessInfoCard from "./guessInfoCard";

interface GuessTableProps {
  guesses: {
    book: Book;
    isTitleCorrect: boolean;
    isYearCorrect: boolean;
    isAuthorCorrect: boolean;
    isGenreCorrect: boolean;
    genreMatches: { genre: string; isCorrect: boolean }[];
  }[];
  correctedYearGuess: number;
}

function GuessCard({ guesses, correctedYearGuess }: GuessTableProps) {
  return (
    <div className="mx-auto mt-8 w-full max-w-4xl rounded-[32px] border border-blue-300/10 bg-[#081423]/90 p-5 shadow-2xl backdrop-blur-xl">
      <div className="flex flex-col gap-6">
        {guesses.map((guess, index) => (
          <div key={index} className="flex flex-col gap-3">
            <div className="flex gap-4">
              <GuessInfoCard
                index={index}
                title="Cover"
                bookCover={guess.book.thumbnail}
                fixedWidth={false}
              />
              <GuessInfoCard
                index={index}
                text={guess.book.title}
                title="Title"
                guessIsCorrect={guess.isTitleCorrect}
              />
              <GuessInfoCard
                index={index}
                text={guess.book.authors[0]}
                title="Author"
                guessIsCorrect={guess.isAuthorCorrect}
              />
              <GuessInfoCard
                index={index}
                text={guess.book.publishedYear.toString()}
                title="Published Year"
                guessIsCorrect={guess.isYearCorrect}
                isCorrectYearMoreRecent={
                  correctedYearGuess > guess.book.publishedYear
                }
              />
              {guess.genreMatches.map((match, idx) => (
                <GuessInfoCard
                  key={idx}
                  index={idx}
                  text={match.genre}
                  title="Genre"
                  guessIsCorrect={match.isCorrect}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default GuessCard;
