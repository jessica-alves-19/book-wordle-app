import { useEffect, useState } from "react";
import type { Book } from "../utils/types";
import booksData from "../data/books.json";

type ImportedBook = {
  id: string;
  title: string;
  authors: string[];
  publishedYear: number;
  cover?: string;
  categories?: string[];
};

export function useBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setBooks(
      (booksData as ImportedBook[]).map(
        (book): Book => ({
          ...book,
          thumbnail: book.cover ?? "",
          description: "",
          categories: book.categories ?? [],
          pageCount: 0,
          language: "en",
          previewLink: "",
        }),
      ),
    );
    setLoading(false);
  }, []);

  return { books, loading };
}
