interface EmptyStateProps {
  query: string;
}

export default function EmptyState({ query }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <span className="text-6xl mb-4">🎬</span>
      <h2 className="text-2xl font-semibold text-gray-200 mb-2">
        No movies found
      </h2>
      <p className="text-gray-400 max-w-sm">
        We could&apos;t find anything for{" "}
        <span className="text-white font-medium">&quot;{query}&quot; </span>
        Try a different search or clear your filters.
      </p>
    </div>
  );
}
