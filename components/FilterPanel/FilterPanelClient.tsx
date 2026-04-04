"use client";

import dynamic from "next/dynamic";


const DynamicFilter = dynamic(() => import("./FilterPanel"), {
  ssr: false,
  loading: () => (
    <div className="h-10 w-40 bg-gray-800 rounded-xl animate-pulse" />
  ),
});

export default function FilterPanelClient({ genres }: { genres: any[] }) {
  return <DynamicFilter genres={genres} />;
}
