export default function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-xl overflow-hidden bg-gray-800">
      <div className="aspect-2/3 bg-gray-700" />
      <div className="p-3 space-y-2">
        <div className="h-4 bg-gray-700 rounded w-3/4" />
        <div className="h-3 bg-gray-700 rounded w-1/2" />
        <div className="h-3 bg-gray-700 rounded w-1/3" />
      </div>
    </div>
  );
}
