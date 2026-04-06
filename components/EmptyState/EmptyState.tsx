import { Ban, Clapperboard } from "lucide-react";

interface EmptyStateProps {
  query: string;
}

export default function EmptyState({ query }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <span className="text-6xl mb-4">
        <Clapperboard width={50} height={50} color="blue" />
      </span>
      <h2 className="flex items-center gap-2 text-2xl font-semibold text-gray-200 mb-2">
        No movies found <Ban width={25} height={25} color="red" />
      </h2>
      <p className="text-gray-300 max-w-sm">
        We couldn&apos;t find anything for{" "}
        <span className="text-white font-medium">&quot;{query}&quot;.</span> <br />
        Try a different search.
      </p>
    </div>
  );
}
