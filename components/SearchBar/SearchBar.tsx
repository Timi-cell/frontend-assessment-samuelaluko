"use client";

import { useDebounce } from "@/hooks/useDebounce";
import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [input, setInput] = useState(searchParams.get("q") ?? "");
  const debouncedInput = useDebounce(input, 320);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (debouncedInput) {
      params.set("q", debouncedInput);
      params.delete("genre");
    } else {
      params.delete("q");
    }
    params.delete("page");
    router.push(`?${params.toString()}`);
  }, [debouncedInput]); //eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div className="relative w-full max-w-xl">
      <label htmlFor="movie-search" className="sr-only">
        Search movies
      </label>
      <span
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        aria-hidden="true"
      >
        <Search width={30} height={30} />
      </span>
      <input
        id="movie-search"
        type="search"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Search movies here..."
        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm"
      />
    </div>
  );
}
