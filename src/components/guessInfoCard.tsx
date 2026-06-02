interface GuessInfoCardProps {
  index: number;
  text?: string;
  title: string;
  guessIsCorrect?: boolean;
  bookCover?: string;
  isCorrectYearMoreRecent?: boolean;
  fixedWidth?: boolean;
}

function GuessInfoCard({
  index,
  text,
  title,
  guessIsCorrect,
  bookCover,
  isCorrectYearMoreRecent,
  fixedWidth = true,
}: GuessInfoCardProps) {
  return (
    <div
      className={`flex ${
        fixedWidth ? "w-[13rem]" : "w-auto"
      } flex-col items-center text-center`}
      key={index}
    >
      <div
        className={`flex h-full w-full flex-col items-center justify-center gap-3 rounded-[32px] border p-4 text-center transition-transform duration-200 hover:scale-[1.02] ${
          guessIsCorrect ? "bg-[#d4ffd4] text-black" : "bg-[#ffd4d4] text-black"
        }`}
      >
        <span className="text-xs font-semibold tracking-wide uppercase">
          {title}
        </span>

        {text && (
          <span
            className={`overflow-hidden text-base leading-snug font-semibold ${
              title.toLowerCase() === "title"
                ? "break-words whitespace-normal"
                : "text-ellipsis whitespace-nowrap"
            }`}
          >
            {title.toLowerCase() === "Published Year".toLowerCase()
              ? text + (isCorrectYearMoreRecent ? " ↑" : " ↓")
              : text}
          </span>
        )}

        {bookCover && (
          <img
            src={bookCover}
            alt={title}
            className="mx-auto max-h-40 w-auto rounded-lg object-contain"
          />
        )}
      </div>
    </div>
  );
}

export default GuessInfoCard;
