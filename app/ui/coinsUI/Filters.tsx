"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";

export default function Filters() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [type, setType] = useState("");
  const [yearMin, setYearMin] = useState("");
  const [yearMax, setYearMax] = useState("");
  const [country, setCountry] = useState("");
  const [expandedSections, setExpandedSections] = useState({
    type: true,
    year: true,
    country: false,
  });

  useEffect(() => {
    setType(searchParams.get("type") ?? "");
    setYearMin(searchParams.get("yearMin") ?? "");
    setYearMax(searchParams.get("yearMax") ?? "");
    setCountry(searchParams.get("country") ?? "");
  }, []);

  const updateParams = useDebouncedCallback(
    (newParams: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(newParams).forEach(([key, value]) => {
        // Clean up any old lowercased keys from previous versions
        params.delete(key);
        params.delete(key.toLowerCase());

        if (value) {
          params.set(key, value);
        }
      });

      router.push(`/coins?${params.toString()}`);
    },
    300,
  );

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const clearFilters = () => {
    setType("");
    setYearMin("");
    setYearMax("");
    setCountry("");
    router.push("/coins");
  };

  const typeOptions = [
    "gold",
    "silver",
    "historical_gold",
    "historical_silver",
    "historical",
  ];

  return (
    <div className="bg-white rounded-lg shadow-md border border-slate-200 p-6 h-fit sticky top-24">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-slate-800">Filters</h2>
        <button
          onClick={clearFilters}
          className="text-sm text-amber-700 hover:text-amber-800 font-medium transition-colors"
        >
          Clear
        </button>
      </div>

      {/* Type Filter */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection("type")}
          className="w-full flex items-center justify-between mb-3 hover:text-amber-700 transition-colors"
        >
          <h3 className="font-semibold text-slate-700">Type</h3>
          <ChevronDown
            size={18}
            className={`transition-transform ${
              expandedSections.type ? "rotate-180" : ""
            }`}
          />
        </button>
        {expandedSections.type && (
          <div className="space-y-2">
            {typeOptions.map((option) => (
              <label
                key={option}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="radio"
                  name="type"
                  value={option}
                  checked={type === option}
                  onChange={(e) => {
                    setType(e.target.value);
                    updateParams({ type: e.target.value });
                  }}
                  className="w-4 h-4 accent-amber-700"
                />
                <span className="text-sm text-slate-600 capitalize">
                  {option.replace("_", " ")}
                </span>
              </label>
            ))}
            <button
              onClick={() => {
                setType("");
                updateParams({ type: "" });
              }}
              className="text-sm text-slate-500 hover:text-slate-700 mt-2"
            >
              Clear type
            </button>
          </div>
        )}
      </div>

      <div className="border-t border-slate-200 my-6"></div>

      {/* Year Filter */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection("year")}
          className="w-full flex items-center justify-between mb-3 hover:text-amber-700 transition-colors"
        >
          <h3 className="font-semibold text-slate-700">Year</h3>
          <ChevronDown
            size={18}
            className={`transition-transform ${
              expandedSections.year ? "rotate-180" : ""
            }`}
          />
        </button>
        {expandedSections.year && (
          <div className="space-y-3">
            <div>
              <label className="text-sm text-slate-600 block mb-1">
                From Year
              </label>
              <input
                type="number"
                placeholder="Min year"
                value={yearMin}
                onChange={(e) => {
                  setYearMin(e.target.value);
                  updateParams({ yearMin: e.target.value });
                }}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm 
                   focus:outline-none focus:ring-2 focus:ring-amber-700 focus:border-transparent"
              />
            </div>
            <div>
              <label className="text-sm text-slate-600 block mb-1">
                To Year
              </label>
              <input
                type="number"
                placeholder="Max year"
                value={yearMax}
                onChange={(e) => {
                  setYearMax(e.target.value);
                  updateParams({ yearMax: e.target.value });
                }}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm 
                   focus:outline-none focus:ring-2 focus:ring-amber-700 focus:border-transparent"
              />
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-slate-200 my-6"></div>

      {/* Country Filter */}
      <div>
        <button
          onClick={() => toggleSection("country")}
          className="w-full flex items-center justify-between mb-3 hover:text-amber-700 transition-colors"
        >
          <h3 className="font-semibold text-slate-700">Country</h3>
          <ChevronDown
            size={18}
            className={`transition-transform ${
              expandedSections.country ? "rotate-180" : ""
            }`}
          />
        </button>
        {expandedSections.country && (
          <div>
            <input
              type="text"
              placeholder="Filter by country"
              value={country}
              onChange={(e) => {
                setCountry(e.target.value);
                updateParams({ country: e.target.value });
              }}
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm 
                 focus:outline-none focus:ring-2 focus:ring-amber-700 focus:border-transparent"
            />
          </div>
        )}
      </div>
    </div>
  );
}
