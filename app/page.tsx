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
// import SkeletonCard from "@/components/Skeleton/SkeletonCard";
import type { SearchParams } from "@/types/tmdb";
import { Clapperboard } from "lucide-react";
import Link from "next/link";
import FilterPanel from "@/components/FilterPanel/FilterPanel";

interface PageProps {
  searchParams: Promise<SearchParams>;
}

export default async function HomePage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const page = Number(resolvedParams.page ?? 1);
  const query = resolvedParams.q ?? "";
  const genre = resolvedParams.genre ?? "";

  // Server-side data fetching — fetch genres for filter panel in parallel
  const [moviesData, genres] = await Promise.all([
    query
      ? searchMovies(query, page)
      : genre
        ? fetchMoviesByGenre(genre, page)
        : fetchPopularMovies(page),
    fetchGenres(),
  ]);

  // Find the genre object that matches the ID in the URL
  const activeGenre = genres.find((g) => String(g.id) === String(genre));

  const genreName = activeGenre ? activeGenre.name : "All Genres";

  const movies = moviesData.results;
  const totalPages = moviesData.total_pages;
  // const activeQuery = query || genre;

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link href={"/"}>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <Clapperboard width={50} height={50} color="blue" /> Movie Explorer
          </h1>
        </Link>
        <p className="text-gray-300">Discover your next favourite movie...</p>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
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
          <FilterPanel genres={genres} />
        </Suspense>
      </div>

      {/* Results */}
      {movies.length === 0 ? (
        <EmptyState query={query || "your filters"} />
      ) : (
        <>
          <p className="text-sm text-gray-300 mb-4">
            Under {genreName}, Movie Explorer has{" "}
            {moviesData.total_results.toLocaleString()} movies for you.
            {/* {query && ` for "${query}"`} */}
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
