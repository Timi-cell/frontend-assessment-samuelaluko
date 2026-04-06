export {getReleaseYear, formatRating, formatRuntime} from "@/lib/utils";

import type { Genre, MovieDetail, TMDBListResponse } from "@/types/tmdb";

const BASE_URL = "https://api.themoviedb.org/3";
export const IMAGE_BASE = "https://image.tmdb.org/t/p";

function getHeaders() {
  return {
    Authorization: `Bearer ${process.env.TMDB_READ_ACCESS_TOKEN}`,
    "Content-Type": "application/json",
  };
}

// Listing page — ISR: fresh every hour, cached between requests
export async function fetchPopularMovies(page = 1): Promise<TMDBListResponse> {
  const res = await fetch(`${BASE_URL}/movie/popular?page=${page}`, {
    headers: getHeaders(),
    next: { revalidate: 3600 }, // ISR: revalidate every 1 hour
  });
  if (!res.ok) throw new Error(`Failed to fetch movies: ${res.status}`);
  return res.json() as Promise<TMDBListResponse>;
}

// Detail page — force-cache: movie data rarely changes
export async function fetchMovieDetail(id: string): Promise<MovieDetail> {
  const res = await fetch(
    `${BASE_URL}/movie/${id}?append_to_response=similar`,
    {
      headers: getHeaders(),
      next: { revalidate: 86400 }, 
    },
  );
  if (!res.ok) throw new Error(`Failed to fetch movie ${id}: ${res.status}`);
  return res.json() as Promise<MovieDetail>;
}

// Search — no-store: results must always be fresh/real-time
export async function searchMovies(
  query: string,
  page = 1,
): Promise<TMDBListResponse> {
  const res = await fetch(
    `${BASE_URL}/search/movie?query=${encodeURIComponent(query)}&page=${page}`,
    {
      headers: getHeaders(),
      cache: "no-store", // Search must never be stale
    },
  );
  if (!res.ok) throw new Error(`Search failed: ${res.status}`);
  return res.json() as Promise<TMDBListResponse>;
}

// Genres — force-cache: genre list essentially never changes
export async function fetchGenres(): Promise<Genre[]> {
  const res = await fetch(`${BASE_URL}/genre/movie/list`, {
    headers: getHeaders(),
    next: { revalidate: 86400 },
  });
  if (!res.ok) throw new Error("Failed to fetch genres");
  const data = (await res.json()) as { genres: Genre[] };
  return data.genres;
}

// Movies by genre
export async function fetchMoviesByGenre(
  genreId: string,
  page = 1,
): Promise<TMDBListResponse> {
  const res = await fetch(
    `${BASE_URL}/discover/movie?with_genres=${genreId}&page=${page}`,
    {
      headers: getHeaders(),
      next: { revalidate: 3600 },
    },
  );
  if (!res.ok) throw new Error(`Failed to fetch genre movies: ${res.status}`);
  return res.json() as Promise<TMDBListResponse>;
}

// Poster URL helper
export function getPosterUrl(
  path: string | null,
  size: "w342" | "w500" | "w780" | "original" = "w342",
): string {
  if (!path) return "/next.svg";
  return `${IMAGE_BASE}/${size}${path}`;
}

