"use client";

import { useDebounce } from "@/hooks/useDebounce";
import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [input, setInput] = useState(searchParams.get("q") ?? "");
  const debouncedInput = useDebounce(input, 300);

  useEffect(() => {
    const currentQuery = searchParams.get("q") ?? "";
    if (debouncedInput !== currentQuery) {
      const params = new URLSearchParams(searchParams.toString());
      if (debouncedInput) {
        params.set("q", debouncedInput);
        params.delete("genre");
      } else {
        params.delete("q");
      }

      params.delete("page");
      router.replace(`?${params.toString()}`);
    }
  }, [debouncedInput]); //eslint-disable-line react-hooks/exhaustive-deps
  // Including router and searchParams in deps would cause infinite re-render loops, I did not include them because they are stable in this context and do not change across renders
  return (
    <div className="relative w-full max-w-xl">
      <label htmlFor="movie-search" className="sr-only">
        Search movies
      </label>
      <span
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        aria-hidden="true"
      >
        <Search width={20} height={20} />
      </span>
      <input
        id="movie-search"
        type="search"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Search for any movie here..."
        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-base sm:text-sm"
      />
    </div>
  );
}
