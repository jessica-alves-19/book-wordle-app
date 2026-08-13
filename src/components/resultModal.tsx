import type { Book } from "../utils/types";

interface ResultModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  book?: Book;
  onClose: () => void;
  onConfirm?: () => void;
  confirmLabel?: string;
}

function ResultModal({
  isOpen,
  title,
  message,
  book,
  onClose,
  onConfirm,
  confirmLabel = "Play again",
}: ResultModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-[32px] border border-blue-400/20 bg-[#09182b]/95 p-6 text-center shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-xl text-blue-100/70 transition hover:text-white"
          aria-label="Close modal"
        >
          ×
        </button>

        <h2 className="text-2xl font-semibold text-white">{title}</h2>
        <p className="mt-3 text-sm text-blue-100/80">{message}</p>

        {book && (
          <div className="mt-5 rounded-[24px] border border-blue-400/20 bg-[#081423]/90 p-4 text-left">
            <div className="flex items-center gap-4">
              <img
                src={book.thumbnail}
                alt={book.title}
                className="h-24 w-16 rounded-lg object-cover"
              />
              <div>
                <h3 className="text-lg font-semibold text-white">
                  {book.title}
                </h3>
                <p className="text-sm text-blue-100/70">{book.authors[0]}</p>
                <p className="text-sm text-blue-100/70">
                  Published: {book.publishedYear}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 flex justify-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-blue-400/20 px-4 py-2 text-sm font-medium text-blue-100 transition hover:bg-blue-500/10"
          >
            Close
          </button>
          {onConfirm && (
            <button
              type="button"
              onClick={() => {
                if (onConfirm) onConfirm();
                onClose();
              }}
              className="rounded-full bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-400"
            >
              {confirmLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ResultModal;
