"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { useState, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";

export default function Filters() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [type, setType] = useState("");
  const [yearMin, setYearMin] = useState("");
  const [yearMax, setYearMax] = useState("");
  const [country, setCountry] = useState("");
  const [countrySearch, setCountrySearch] = useState("");
  const [availableCountries, setAvailableCountries] = useState<string[]>([]);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const countryInputRef = useRef<HTMLInputElement>(null);
  const [expandedSections, setExpandedSections] = useState({
    type: true,
    year: true,
    country: false,
  });

  useEffect(() => {
    setType(searchParams.get("type") ?? "");
    setYearMin(searchParams.get("yearMin") ?? "");
    setYearMax(searchParams.get("yearMax") ?? "");
    const countryParam = searchParams.get("country") ?? "";
    setCountry(countryParam);
    setCountrySearch(countryParam);
  }, []);

  // Fetch available countries
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch("/api/coins/countries");
        if (response.ok) {
          const countries = await response.json();
          setAvailableCountries(countries);
        }
      } catch (error) {
        console.error("Failed to fetch countries:", error);
      }
    };
    fetchCountries();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        countryInputRef.current &&
        !countryInputRef.current.contains(event.target as Node)
      ) {
        setShowCountryDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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
    setCountrySearch("");
    router.push("/coins");
  };

  // Filter countries based on search input
  const filteredCountries = availableCountries.filter((c) =>
    c.toLowerCase().includes(countrySearch.toLowerCase()),
  );

  const handleCountrySelect = (selectedCountry: string) => {
    setCountry(selectedCountry);
    setCountrySearch(selectedCountry);
    setShowCountryDropdown(false);
    updateParams({ country: selectedCountry });
  };

  const typeOptions = [
    "gold",
    "silver",
    "historical_gold",
    "historical_silver",
    "historical",
  ];

  return (
    <div className="bg-white border border-[#cccccc] p-4 h-fit sticky top-20">
      <div className="flex justify-between items-center mb-4 border-b border-[#d4af37] pb-2">
        <h2 className="text-base font-semibold text-[#2c5282]">Filters</h2>
        <button
          onClick={clearFilters}
          className="text-sm text-[#2c5282] hover:text-[#1e3a5f] font-medium"
        >
          Clear
        </button>
      </div>

      {/* Type Filter */}
      <div className="mb-4">
        <button
          onClick={() => toggleSection("type")}
          className="w-full flex items-center justify-between mb-2 hover:text-[#2c5282]"
        >
          <h3 className="font-semibold text-[#333333] text-sm">Type</h3>
          <ChevronDown
            size={16}
            className={`${expandedSections.type ? "rotate-180" : ""}`}
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
                  className="w-4 h-4 accent-[#2c5282]"
                />
                <span className="text-sm text-[#555555] capitalize">
                  {option.replace("_", " ")}
                </span>
              </label>
            ))}
            <button
              onClick={() => {
                setType("");
                updateParams({ type: "" });
              }}
              className="text-sm text-[#666666] hover:text-[#333333] mt-2"
            >
              Clear type
            </button>
          </div>
        )}
      </div>

      <div className="border-t border-[#cccccc] my-4"></div>

      {/* Year Filter */}
      <div className="mb-4">
        <button
          onClick={() => toggleSection("year")}
          className="w-full flex items-center justify-between mb-2 hover:text-[#2c5282]"
        >
          <h3 className="font-semibold text-[#333333] text-sm">Year</h3>
          <ChevronDown
            size={16}
            className={`${expandedSections.year ? "rotate-180" : ""}`}
          />
        </button>
        {expandedSections.year && (
          <div className="space-y-2">
            <div>
              <label className="text-xs text-[#666666] block mb-1">
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
                className="w-full px-2 py-1.5 border border-[#cccccc] text-sm 
                   focus:outline-none focus:border-[#2c5282]"
              />
            </div>
            <div>
              <label className="text-xs text-[#666666] block mb-1">
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
                className="w-full px-2 py-1.5 border border-[#cccccc] text-sm 
                   focus:outline-none focus:border-[#2c5282]"
              />
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-[#cccccc] my-4"></div>

      {/* Country Filter */}
      <div>
        <button
          onClick={() => toggleSection("country")}
          className="w-full flex items-center justify-between mb-2 hover:text-[#2c5282]"
        >
          <h3 className="font-semibold text-[#333333] text-sm">Country</h3>
          <ChevronDown
            size={16}
            className={`${expandedSections.country ? "rotate-180" : ""}`}
          />
        </button>
        {expandedSections.country && (
          <div className="relative" ref={countryInputRef}>
            <input
              type="text"
              placeholder="Search countries..."
              value={countrySearch}
              onChange={(e) => {
                setCountrySearch(e.target.value);
                setShowCountryDropdown(true);
                if (!e.target.value) {
                  setCountry("");
                  updateParams({ country: "" });
                }
              }}
              onFocus={() => setShowCountryDropdown(true)}
              className="w-full px-2 py-1.5 border border-[#cccccc] text-sm 
                 focus:outline-none focus:border-[#2c5282]"
            />
            {showCountryDropdown && filteredCountries.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-[#cccccc] max-h-60 overflow-y-auto">
                {filteredCountries.map((countryOption) => (
                  <button
                    key={countryOption}
                    onClick={() => handleCountrySelect(countryOption)}
                    className={`w-full text-left px-2 py-1.5 text-sm hover:bg-[#f5f5f5] ${
                      country === countryOption
                        ? "bg-[#e8f0f8] text-[#2c5282] font-medium"
                        : "text-[#555555]"
                    }`}
                  >
                    {countryOption}
                  </button>
                ))}
              </div>
            )}
            {countrySearch && filteredCountries.length === 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-[#cccccc] p-2">
                <p className="text-sm text-[#666666]">No countries found</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
