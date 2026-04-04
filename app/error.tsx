"use client";

import { useRouter } from "next/navigation";
import { startTransition, useEffect } from "react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
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
      <span className="text-6xl mb-6">⚠️</span>
      <h1 className="text-2xl font-bold text-white mb-2">
        Something went wrong
      </h1>
      <p className="text-gray-400 max-w-md mb-8">
        We couldn&apos;t load the movies right now. Check your network connection and try again.
      </p>
      <button
        onClick={handleReset}
        className="px-6 py-3 bg-yellow-400 text-black font-semibold rounded-xl hover:bg-yellow-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
      >
        Try Again
      </button>
    </main>
  );
}
