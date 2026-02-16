"use client";

import { FormEvent, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

type Coin = {
  id: number;
  name: string | null;
  year: number | null;
  country: string | null;
  price: number;
  type: string | null;
  description: string | null;
  denomination: string | null;
  imageUrl: string | null;
  stock: number;
};

export default function CoinModifyForm() {
  const searchParams = useSearchParams();
  const coinId = searchParams.get("id");

  const [coin, setCoin] = useState<Coin | null>(null);
  const [loadingCoin, setLoadingCoin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!coinId) {
      setLoadingCoin(false);
      return;
    }
    async function fetchCoin() {
      try {
        const response = await fetch(`/api/coins?id=${coinId}`);
        if (!response.ok) throw new Error("Failed to fetch coin");
        const data = await response.json();
        setCoin(data);
      } catch {
        setError("Failed to load coin data");
      } finally {
        setLoadingCoin(false);
      }
    }
    fetchCoin();
  }, [coinId]);

  async function modifyCoin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const formData = new FormData(e.currentTarget);

    // Handle file upload if a new file was selected
    const file = formData.get("file") as File;
    let imageUrl = coin?.imageUrl ?? null;

    if (file && file.size > 0) {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random()
        .toString(36)
        .substring(7)}.${fileExt}`;

      const uploadFormData = new FormData();
      uploadFormData.append("file", file);
      uploadFormData.append("fileName", fileName);

      try {
        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: uploadFormData,
        });

        if (!uploadResponse.ok) {
          throw new Error("Failed to upload image");
        }

        const { url } = await uploadResponse.json();
        imageUrl = url;
      } catch {
        setError("Failed to upload image");
        setLoading(false);
        return;
      }
    }

    try {
      const response = await fetch("/api/coins/modify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: Number(coinId),
          name: formData.get("name"),
          year: formData.get("year")
            ? parseInt(formData.get("year") as string)
            : null,
          country: formData.get("country"),
          price: parseInt(formData.get("price") as string),
          type: formData.get("type") || null,
          description: formData.get("description") || null,
          denomination: formData.get("denomination") || null,
          stock: parseInt(formData.get("stock") as string) || 0,
          imageUrl,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to modify coin");
      }

      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }

  if (!coinId) {
    return (
      <div className="max-w-2xl mx-auto p-8 text-center">
        <p className="text-[#666666] mb-4">No coin ID provided.</p>
        <Link
          href="/coins"
          className="text-[#2c5282] hover:text-[#1e3a5f] font-medium"
        >
          ← Back to coins
        </Link>
      </div>
    );
  }

  if (loadingCoin) {
    return (
      <div className="max-w-2xl mx-auto p-8 text-center">
        <p className="text-[#666666]">Loading coin data...</p>
      </div>
    );
  }

  if (!coin) {
    return (
      <div className="max-w-2xl mx-auto p-8 text-center">
        <p className="text-[#666666] mb-4">Coin not found.</p>
        <Link
          href="/coins"
          className="text-[#2c5282] hover:text-[#1e3a5f] font-medium"
        >
          ← Back to coins
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-8">
      <Link
        href={`/coins/${coinId}`}
        className="text-[#2c5282] hover:text-[#1e3a5f] font-medium mb-4 inline-flex items-center gap-1"
      >
        ← Back to coin
      </Link>

      <h1 className="text-3xl font-bold mb-6 text-[#2c5282]">Modify Coin</h1>

      {coin.imageUrl && (
        <div className="mb-6 bg-[#f5f5f5] border border-[#e0e0e0] p-4 flex items-center justify-center">
          <div className="relative w-48 h-48">
            <Image
              src={coin.imageUrl}
              alt={coin.name || "Coin image"}
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-700">{error}</p>
        </div>
      )}
      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md">
          <p className="text-green-700">Coin modified successfully!</p>
        </div>
      )}

      <form onSubmit={modifyCoin} className="space-y-5">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Coin Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            defaultValue={coin.name ?? ""}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="year"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Year
          </label>
          <input
            type="text"
            id="year"
            name="year"
            defaultValue={coin.year ?? ""}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="country"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Country <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="country"
            name="country"
            required
            defaultValue={coin.country ?? ""}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="price"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Price (in dollars) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="price"
            name="price"
            required
            defaultValue={coin.price}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="type"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Type
          </label>
          <select
            id="type"
            name="type"
            defaultValue={coin.type ?? ""}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="" disabled>
              Select a type
            </option>
            <option value="silver">Silver</option>
            <option value="gold">Gold</option>
            <option value="historical_gold">Historical Gold</option>
            <option value="historical_silver">Historical Silver</option>
            <option value="historical">Historical (i.e. world history)</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            defaultValue={coin.description ?? ""}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="denomination"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Denomination
          </label>
          <input
            type="text"
            id="denomination"
            name="denomination"
            defaultValue={coin.denomination ?? ""}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="stock"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Stock Quantity <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="stock"
            name="stock"
            min="0"
            required
            defaultValue={coin.stock}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="file"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Replace Image (optional)
          </label>
          <input
            type="file"
            id="file"
            name="file"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full px-4 py-2 rounded-md font-medium text-white transition-colors ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#2c5282] hover:bg-[#1e3a5f] active:bg-[#163050]"
          }`}
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
