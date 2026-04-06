import SkeletonCard from "@/components/Skeleton/SkeletonCard";

export default function Loading() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="h-8 w-48 bg-gray-800 rounded animate-pulse mb-2" />
        <div className="h-4 w-64 bg-gray-800 rounded animate-pulse" />
      </div>
      <div className="flex gap-3 mb-8">
        <div className="h-10 flex-1 bg-gray-800 rounded-xl animate-pulse" />
        <div className="h-10 w-40 bg-gray-800 rounded-xl animate-pulse" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
        {Array.from({ length: 21 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </main>
  );
}
