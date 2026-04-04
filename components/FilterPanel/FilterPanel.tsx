"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type { Genre } from "@/types/tmdb";

interface FilterPanelProps {
  genres: Genre[];
}

export default function FilterPanel({ genres }: FilterPanelProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeGenre = searchParams.get("genre") ?? "";

  const handleGenreChange = (genreId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (genreId) {
      params.set("genre", genreId);
      params.delete("q");
    } else {
      params.delete("genre");
    }
    params.delete("page");
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2">
      <label
        htmlFor="genre-filter"
        className="text-sm text-gray-400 whitespace-nowrap"
      >
        Genre:
      </label>
      <select
        id="genre-filter"
        value={activeGenre}
        onChange={(e) => handleGenreChange(e.target.value)}
        className="bg-gray-800 border border-gray-700 text-white text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-yellow-400"
      >
        <option value="">All Genres</option>
        {genres.map((genre) => (
            <option key={genre.id} value={String(genre.id)}>
                {genre.name}
            </option>
        ))}
      </select>
    </div>
  );
}
