import { Clapperboard } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen text-center px-4">
      <span className="text-6xl mb-6">
        <Clapperboard width={100} height={100} color="blue" />
      </span>
      <h1 className="text-3xl font-bold text-white mb-2">Can&apos;t display this movie&apos;s details</h1>
      <p className="text-gray-300 mb-8">
       Please check your network connection.
      </p>
      <Link
        href="/"
        className="px-6 py-3 bg-yellow-400 text-black font-semibold rounded-xl hover:bg-yellow-300 transition-colors"
      >
        Back to All Movies
      </Link>
    </main>
  );
}
