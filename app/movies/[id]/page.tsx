import Image from "next/image";
import {
  fetchMovieDetail,
  getPosterUrl,
  getReleaseYear,
  formatRating,
  formatRuntime,
} from "@/lib/tmdb";
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import MovieCard from "@/components/MovieCard/MovieCard";
import { Suspense } from "react";
import SkeletonCard from "@/components/Skeleton/SkeletonCard";
import type { Metadata } from "next";
import NotFound from "@/app/not-found";
import { CalendarDays, Clapperboard, Clock, Star } from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

// Generate metadata for SEO + og:image — required by spec
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const movie = await fetchMovieDetail(id);
    console.log(movie);

    return {
      title: movie.title,
      description: movie.overview,
      openGraph: {
        title: movie.title,
        description: movie.overview,
        images: movie.backdrop_path
          ? [{ url: getPosterUrl(movie.backdrop_path, "w780"), width: 780 }]
          : [],
      },
    };
  } catch {
    return { title: "Movie Not Found" };
  }
}

export default async function MovieDetailPage({
  params,
  searchParams,
}: PageProps) {
  const { id } = await params;
  const sParams = await searchParams;

  const queryString = new URLSearchParams(
    sParams as Record<string, string>,
  ).toString();
  const backToMoviesUrl = queryString ? `/?${queryString}` : "/";

  let movie;
  try {
    movie = await fetchMovieDetail(id);
  } catch {
    return <NotFound />;
  }

  const posterUrl = getPosterUrl(movie.poster_path, "w342");
  const backdropUrl = getPosterUrl(movie.backdrop_path, "original");
  const similarMovies = movie.similar?.results.slice(0, 4) ?? [];
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb
        crumbs={[
          { label: "Home", href: "/" },
          {
            label: "Back to Movies",
            href: backToMoviesUrl,
          },
          { label: movie.title },
        ]}
      />

      {/* Backdrop */}
      {movie.backdrop_path && (
        <div className="relative h-64 sm:h-80 rounded-2xl overflow-hidden mb-8">
          <Image
            src={backdropUrl}
            alt={`${movie.title} backdrop`}
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-t from-gray-950 via-gray-950/50 to-transparent" />
        </div>
      )}

      {/* Movie Info */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Poster */}
        <div className="relative w-48 h-72 shrink-0 rounded-xl overflow-hidden self-start">
          {!movie.poster_path ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-800 text-gray-600">
              <span className="text-5xl mb-8">
                <Clapperboard width={100} height={100} color="blue" />
              </span>
              <span className="text-base sm:text-sm text-center px-2 text-gray-500 line-clamp-2">
                No image for {`"${movie.title}"`}
              </span>
            </div>
          ) : (
            <Image
              src={posterUrl}
              alt={`${movie.title} poster`}
              fill
              sizes="192px"
              className="object-cover w-full"
              priority
            />
          )}
        </div>

        {/* Details */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-white mb-1">{movie.title}</h1>
          {movie.tagline && (
            <p className="text-yellow-400 italic mb-4">
              &quot;{movie.tagline}&quot;
            </p>
          )}

          <div className="flex flex-wrap gap-4 text-sm text-gray-300 mb-4">
            <span className="flex items-center gap-2">
              <CalendarDays width={15} height={15} color="blue" />
              {getReleaseYear(movie.release_date)}
            </span>
            <span className="flex items-center gap-2">
              <Star width={15} height={15} color="yellow" fill="yellow" />{" "}
              {formatRating(movie.vote_average)} / 10
            </span>
            {movie.runtime && (
              <span className="flex items-center gap-2">
                <Clock width={15} height={15} color="black" fill="white" />
                {formatRuntime(movie.runtime)}
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {movie.genres.map((genre) => (
              <span
                key={genre.id}
                className="px-3 py-1 bg-gray-800 rounded-full text-xs text-gray-300"
              >
                {genre.name}
              </span>
            ))}
          </div>

          <p className="text-gray-200 leading-relaxed">{movie.overview}</p>
        </div>
      </div>

      {/* Bonus B-2: Suspense boundary around slow "Similar Movies" fetch */}
      {similarMovies.length > 0 && (
        <section className="mt-12" aria-label="Similar movies">
          <h2 className="text-xl font-bold text-white mb-4">
            You Might Also Like
          </h2>
          <Suspense
            fallback={
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            }
          >
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {similarMovies.map((m) => (
                <MovieCard key={m.id} movie={m} />
              ))}
            </div>
          </Suspense>
        </section>
      )}
    </main>
  );
}
