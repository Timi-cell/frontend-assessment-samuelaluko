"use client";
import Image from "next/image";
import Link from "next/link";
import { getPosterUrl, getReleaseYear, formatRating } from "@/lib/tmdb";
import type { Movie } from "@/types/tmdb";
import { useSearchParams } from "next/navigation";
import { Star } from "lucide-react";
import { formatNumber } from "@/lib/utils";

interface MovieCardProps {
  movie: Movie;
  priority?: boolean;
}

export default function MovieCard({ movie, priority = false }: MovieCardProps) {
  const posterUrl = getPosterUrl(movie.poster_path, "w500");
  const year = getReleaseYear(movie.release_date);
  const rating = formatRating(movie.vote_average);
  const searchParams = useSearchParams()?.toString() || "";

  return (
    <Link
      href={`/movies/${movie.id}?${searchParams}`}
      className="group relative rounded-xl overflow-hidden bg-gray-900 hover:ring-2 hover:ring-yellow-400 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
      aria-label={`${movie.title} (${year}), rated ${rating}`}
    >
      {/* Poster */}
      <div className="relative aspect-2/3 w-full  overflow-hidden">
        <Image
          src={posterUrl}
          alt={`${movie.title} poster`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          priority={priority}
          placeholder="blur"
          blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzQyIiBoZWlnaHQ9IjUxMyIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMWYyOTM3Ii8+PC9zdmc+"
        />
        {/* Rating badge */}
        <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm text-yellow-400 text-xs font-bold px-2 py-1 rounded-md flex items-center gap-2">
          <span aria-hidden="true">
            <Star width={13} height={13} color="yellow" fill="yellow" />
          </span>
          <span>{rating}</span>
        </div>
      </div>

      {/* Info */}
      <div className="p-3">
        <h2 className="font-semibold text-sm text-white line-clamp-2 leading-snug mb-1">
          {movie.title}
        </h2>
        <p className="text-xs text-gray-300">{year}</p>
        <p className="text-xs text-gray-400 mt-0.5">
          {formatNumber(movie.vote_count)} votes
        </p>
      </div>
    </Link>
  );
}
