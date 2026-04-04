import { Suspense } from "react";
import {
  fetchPopularMovies,
  fetchMoviesByGenre,
  searchMovies,
  fetchGenres,
} from "@/lib/tmdb";
import MovieCard from "@/components/MovieCard/MovieCard";
import SearchBar from "@/components/SearchBar/SearchBar";
import Pagination from "@/components/Pagination/Pagination";
import EmptyState from "@/components/EmptyState/EmptyState";
import SkeletonCard from "@/components/Skeleton/SkeletonCard";
import type { SearchParams } from "@/types/tmdb";
import type { Metadata } from "next";
import FilterPanelClient from "@/components/FilterPanel/FilterPanelClient";


export const metadata: Metadata = {
  title: "Discover Movies",
  description: "Browse and search thousands of movies from TMDB.",
};

interface PageProps {
  searchParams: SearchParams;
}

export default async function HomePage({ searchParams }: PageProps) {
  const page = Number(searchParams.page ?? 1);
  const query = searchParams.query ?? "";
  const genre = searchParams.genre ?? "";

  // Server-side data fetching — fetch genres for filter panel in parallel
  const [moviesData, genres] = await Promise.all([
    query
      ? searchMovies(query, page)
      : genre
        ? fetchMoviesByGenre(genre, page)
        : fetchPopularMovies(page),
    fetchGenres(),
  ]);

  const movies = moviesData.results;
  const totalPages = moviesData.total_pages;
  const activeQuery = query || genre;

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">🎬 CineExplorer</h1>
        <p className="text-gray-400">Discover your next favourite movie</p>
      </div>

      {/* Search + Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <Suspense
          fallback={
            <div className="h-10 flex-1 bg-gray-800 rounded-xl animate-pulse" />
          }
        >
          <SearchBar />
        </Suspense>
        <Suspense
          fallback={
            <div className="h-10 w-40 bg-gray-800 rounded-xl animate-pulse" />
          }
        >
          <FilterPanelClient genres={genres} />
        </Suspense>
      </div>

      {/* Results */}
      {movies.length === 0 ? (
        <EmptyState query={query || "your filters"} />
      ) : (
        <>
          <p className="text-sm text-gray-500 mb-4">
            {moviesData.total_results.toLocaleString()} results
            {query && ` for "${query}"`}
          </p>

          {/* Responsive Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {movies.map((movie, index) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                priority={index < 8} // above-the-fold images get priority
              />
            ))}
          </div>

          {/* Pagination */}
          <Suspense>
            <Pagination currentPage={page} totalPages={totalPages} />
          </Suspense>
        </>
      )}
    </main>
  );
}
