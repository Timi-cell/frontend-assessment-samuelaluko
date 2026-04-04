export default function MovieDetailLoading() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="h-4 w-48 bg-gray-800 rounded animate-pulse mb-6" />
      <div className="h-64 sm:h-80 bg-gray-800 rounded-2xl animate-pulse mb-8" />
      <div className="flex gap-8">
        <div className="w-48 h-72 bg-gray-800 rounded-xl animate-pulse shrink-0" />
        <div className="flex-1 space-y-4">
          <div className="h-8 bg-gray-800 rounded w-2/3 animate-pulse" />
          <div className="h-4 bg-gray-800 rounded w-1/3 animate-pulse" />
          <div className="h-20 bg-gray-800 rounded animate-pulse" />
        </div>
      </div>
    </main>
  );
}
