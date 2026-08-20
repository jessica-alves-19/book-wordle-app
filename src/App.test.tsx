import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import App from "./App";
import type { Book } from "./utils/types";

const { books } = vi.hoisted(() => ({
  books: [
    {
      id: "correct-book",
      title: "Correct Book",
      authors: ["Correct Author"],
      description: "",
      publishedYear: 2020,
      categories: ["Fiction"],
      pageCount: 100,
      language: "en",
      thumbnail: "correct-book.jpg",
      previewLink: "",
    },
    {
      id: "guessed-book",
      title: "Guessed Book",
      authors: ["Guessed Author"],
      description: "",
      publishedYear: 2010,
      categories: ["Fiction"],
      pageCount: 100,
      language: "en",
      thumbnail: "guessed-book.jpg",
      previewLink: "",
    },
  ] as Book[],
}));

vi.mock("./hooks/useBooks", () => ({
  useBooks: () => ({ books, loading: false }),
}));

describe("guess flow", () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("opens the result modal when the same book is guessed a second time", async () => {
    vi.spyOn(Math, "random").mockReturnValue(0);
    render(<App />);

    const input = await screen.findByPlaceholderText("Write Book Name");
    const searchButton = screen.getByRole("button", { name: "Search" });

    fireEvent.change(input, { target: { value: "Guessed Book" } });
    fireEvent.click(searchButton);
    expect(
      screen.queryByRole("heading", { name: "Already guessed" }),
    ).toBeNull();

    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: "Already guessed" }),
      ).toBeTruthy();
    });
    expect(
      screen.getByText("You have already guessed this book."),
    ).toBeTruthy();
  });

  it("opens a modal when the submitted title is not in the book list", () => {
    render(<App />);

    const input = screen.getByPlaceholderText("Write Book Name");
    const searchButton = screen.getByRole("button", { name: "Search" });

    fireEvent.change(input, { target: { value: "Unknown Book" } });
    fireEvent.click(searchButton);

    expect(
      screen.getByRole("heading", { name: "Book not found" }),
    ).toBeTruthy();
    expect(screen.getByText("Please enter a valid book title.")).toBeTruthy();
    expect(screen.getByText("Guesses:").parentElement?.textContent).toContain(
      "0 / 10",
    );
  });

  it("opens the correct result modal for the right book", async () => {
    vi.spyOn(Math, "random").mockReturnValue(0);
    render(<App />);

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    const input = screen.getByPlaceholderText("Write Book Name");
    fireEvent.change(input, { target: { value: "Correct Book" } });
    fireEvent.click(screen.getByRole("button", { name: "Search" }));

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: "🎉 Correct!" })).toBeTruthy();
    });
    expect(screen.getByText("You guessed the right book.")).toBeTruthy();
  });
});
