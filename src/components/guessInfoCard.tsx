interface GuessInfoCardProps {
  index: number;
  text?: string;
  title: string;
  guessIsCorrect?: boolean;
  bookCover?: string;
  isCorrectYearMoreRecent?: boolean;
}

function GuessInfoCard({
  index,
  text,
  title,
  guessIsCorrect,
  bookCover,
  isCorrectYearMoreRecent,
}: GuessInfoCardProps) {
  return (
    <div
      className="justify-centerflex flex grid grid-cols-1 flex-col items-center justify-center gap-2 p-4 text-center"
      key={index}
    >
      <div
        className={`mr-1 grid inline-flex w-full grid-cols-5 flex-col gap-4 rounded-[32px] border px-3 py-2 transition-transform duration-200 hover:scale-[1.02] ${
          guessIsCorrect && guessIsCorrect
            ? "bg-[#d4ffd4] text-black"
            : "bg-[#ffd4d4] text-black"
        }`}
      >
        <span className="text-xs font-semibold tracking-wide uppercase">
          {title}
        </span>

        {text && (
          <span className="mt-1 text-center text-base leading-snug font-semibold break-words">
            {title.toLowerCase() === "Published Year".toLowerCase()
              ? text + (isCorrectYearMoreRecent ? " ↑" : " ↓")
              : text}
          </span>
        )}
        {bookCover && (
          <img
            src={bookCover}
            alt={title}
            className="mt-2 h-32 w-24 object-cover"
          />
        )}
      </div>
    </div>
  );
}

export default GuessInfoCard;
