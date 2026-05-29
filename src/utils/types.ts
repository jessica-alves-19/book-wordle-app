export interface Book {
  id: string;
  title: string;
  authors: string[];
  description: string;
  publishedYear: number;
  categories: string[];
  pageCount: number;
  language: string;
  thumbnail: string;
  previewLink: string;
}
