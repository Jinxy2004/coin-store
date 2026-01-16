"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { useState, useEffect } from "react";

export default function SearchBar() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Keeps track of state for typing
  const [type, setType] = useState(searchParams.get("type") ?? "");
  const [yearMin, setYearMin] = useState(searchParams.get("yearMin") ?? "");
  const [yearMax, setYearMax] = useState(searchParams.get("yearMax") ?? "");

  useEffect(() => {
    setType(searchParams.get("type") ?? "");
    setYearMin(searchParams.get("yearMin") ?? "");
    setYearMax(searchParams.get("yearMax") ?? "");
  }, [searchParams]);

  // Debounced function for updating the users params
  const updateParams = useDebouncedCallback(
    (newParams: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(newParams).forEach(([key, value]) => {
        if (value) params.set(key, value);
        else params.delete(key);
      });

      router.push(`/coins?${params.toString()}`);
    },
    300
  );

  return (
    <div className="flex gap-2">
      <input
        placeholder="Type (gold, silver)"
        value={type}
        onChange={(e) => {
          setType(e.target.value); // instant UI update
          updateParams({ type: e.target.value }); // debounced URL update
        }}
      />

      <input
        placeholder="Year min"
        value={yearMin}
        onChange={(e) => {
          setYearMin(e.target.value);
          updateParams({ yearMin: e.target.value });
        }}
      />

      <input
        placeholder="Year max"
        value={yearMax}
        onChange={(e) => {
          setYearMax(e.target.value);
          updateParams({ yearMax: e.target.value });
        }}
      />
    </div>
  );
}
