import { useEffect, useState } from "react";
import type { Book } from "../utils/types";
import booksData from "../data/books.json";

export function useBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setBooks(booksData as Book[]);
    setLoading(false);
  }, []);

  return { books, loading };
}
