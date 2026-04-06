import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import MovieCard from "@/components/MovieCard/MovieCard";
import type { Movie } from "@/types/tmdb";

const mockMovie: Movie = {
  id: 1,
  title: "The Dark Knight",
  overview: "Batman faces the Joker.",
  poster_path: "/poster.jpg",
  backdrop_path: null,
  release_date: "2008-07-18",
  vote_average: 9.0,
  vote_count: 30000,
  genre_ids: [28, 80],
  popularity: 100,
};

describe("MovieCard", () => {
  it("renders the movie title", () => {
    render(<MovieCard movie={mockMovie} />);
    expect(screen.getByText("The Dark Knight")).toBeInTheDocument();
  });

  it("renders the release year", () => {
    render(<MovieCard movie={mockMovie} />);
    expect(screen.getByText("2008")).toBeInTheDocument();
  });

  it("renders the rating badge", () => {
    render(<MovieCard movie={mockMovie} />);
    expect(screen.getByText("9.0")).toBeInTheDocument();
  });

  it("links to the correct movie detail page", () => {
    render(<MovieCard movie={mockMovie} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/movies/1?");
  });
});
