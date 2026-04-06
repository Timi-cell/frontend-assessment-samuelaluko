"use client";

import { Clapperboard } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { startTransition, useEffect } from "react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function MovieError({ error, reset }: ErrorProps) {
    const router = useRouter();
  useEffect(() => {
    console.error(error);
  }, [error]);

  const handleReset = () => {
    startTransition(() => {
        router.refresh();
        reset();
    })
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen text-center px-4">
      <span className="text-6xl mb-6">
        <Clapperboard width={100} height={100} color="blue" />
      </span>
      <h1 className="text-2xl font-bold text-white mb-2">
        Couldn&apos;t load this movie
      </h1>
      <p className="text-gray-300 mb-8 max-w-sm">
        Something went wrong fetching this movie. Try again or go back to
        browsing.
      </p>
      <div className="flex gap-4">
        <button
          onClick={handleReset}
          className="px-6 py-3 bg-yellow-400 text-black font-semibold rounded-xl hover:bg-yellow-300 transition-colors"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="px-6 py-3 bg-gray-800 text-white font-semibold rounded-xl hover:bg-gray-700 transition-colors"
        >
          Back to Movies
        </Link>
      </div>
    </main>
  );
}
