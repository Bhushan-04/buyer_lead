"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import debounce from "lodash.debounce";

type Buyer = {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  city: string;
  propertyType: string;
  bhk: string;
  purpose: string;
  budgetMin?: number;
  budgetMax?: number;
  timeline: string;
  status: string;
  updatedAt: string;
};

export default function BuyersPage({
  initialData,
  initialTotal,
  pageSize,
}: {
  initialData: Buyer[];
  initialTotal: number;
  pageSize: number;
}) {
  const searchParams = useSearchParams();

  const [buyers, setBuyers] = useState<Buyer[]>(initialData);
  const [total, setTotal] = useState(initialTotal);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  const [filters, setFilters] = useState({
    city: searchParams.get("city") || "",
    propertyType: searchParams.get("propertyType") || "",
    status: searchParams.get("status") || "",
    timeline: searchParams.get("timeline") || "",
  });

  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");

  // Fetch buyers client-side
  const fetchBuyers = async (query: string, filters: any, page: number) => {
    setLoading(true);
    const params = new URLSearchParams();
    if (query) params.append("search", query);
    Object.entries(filters).forEach(([k, v]) => v && params.append(k, String(v)));
    params.append("page", String(page));
    params.append("pageSize", String(pageSize));
    params.append("sort", "updatedAt:desc");

    try {
      const res = await fetch(`/api/buyers?${params.toString()}`);
      const { rows, count } = await res.json();
      setBuyers(rows);
      setTotal(count);
    } catch (err) {
      console.error("Failed to fetch buyers", err);
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetch = debounce(fetchBuyers, 400);

  useEffect(() => {
    if (page === 1 && buyers.length === initialData.length && total === initialTotal) return;
    debouncedFetch(searchTerm, filters, page);
  }, [searchTerm, filters, page]);

  const totalPages = Math.ceil(total / pageSize);

  // Export current filters
  const handleExport = async () => {
    const params = new URLSearchParams();
    if (searchTerm) params.append("search", searchTerm);
    Object.entries(filters).forEach(([k, v]) => v && params.append(k, String(v)));

    const res = await fetch(`/api/buyers/export?${params.toString()}`);
    if (!res.ok) return alert("Export failed");

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "buyers.xlsx";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Buyers List</h1>

      {/* Filters */}
      <div className="flex gap-4 mb-4">
        <select
          value={filters.city}
          onChange={(e) => setFilters({ ...filters, city: e.target.value })}
          className="border p-2 rounded"
        >
          <option value="">All Cities</option>
          <option>Chandigarh</option>
          <option>Mohali</option>
          <option>Zirakpur</option>
          <option>Panchkula</option>
          <option>Other</option>
        </select>

        <select
          value={filters.propertyType}
          onChange={(e) => setFilters({ ...filters, propertyType: e.target.value })}
          className="border p-2 rounded"
        >
          <option value="">All Types</option>
          <option>Apartment</option>
          <option>Villa</option>
          <option>Plot</option>
          <option>Office</option>
          <option>Retail</option>
        </select>

        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          className="border p-2 rounded"
        >
          <option value="">All Status</option>
          <option>New</option>
          <option>Qualified</option>
          <option>Contacted</option>
          <option>Visited</option>
          <option>Negotiation</option>
          <option>Converted</option>
          <option>Dropped</option>
        </select>

        <select
          value={filters.timeline}
          onChange={(e) => setFilters({ ...filters, timeline: e.target.value })}
          className="border p-2 rounded"
        >
          <option value="">All Timelines</option>
          <option>0-3m</option>
          <option>3-6m</option>
          <option>&gt;6m</option>
          <option>Exploring</option>
        </select>

        <input
          type="text"
          placeholder="Search by name, phone, email"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 rounded flex-1"
        />

        <button
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          onClick={handleExport}
        >
          Export
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <p>Loading buyers...</p>
      ) : buyers.length === 0 ? (
        <p>No buyers found.</p>
      ) : (
        <table className="w-full border border-gray-300 rounded">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Phone</th>
              <th className="p-2 border">City</th>
              <th className="p-2 border">PropertyType</th>
              <th className="p-2 border">Budget</th>
              <th className="p-2 border">Timeline</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">UpdatedAt</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {buyers.map((b) => (
              <tr key={b.id} className="hover:bg-gray-50">
                <td className="p-2 border">{b.fullName}</td>
                <td className="p-2 border">{b.phone}</td>
                <td className="p-2 border">{b.city}</td>
                <td className="p-2 border">{b.propertyType}</td>
                <td className="p-2 border">
                  ₹{(b.budgetMin || 0).toLocaleString()} - ₹{(b.budgetMax || 0).toLocaleString()}
                </td>
                <td className="p-2 border">{b.timeline}</td>
                <td className="p-2 border">{b.status}</td>
                <td className="p-2 border">{new Date(b.updatedAt).toLocaleString()}</td>
                <td className="p-2 border flex gap-2">
                  <button
                    className="px-2 py-1 bg-gray-300 rounded hover:bg-gray-400"
                    onClick={() => (window.location.href = `/buyers/${b.id}`)}
                  >
                    View
                  </button>
                  <button
                    className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    onClick={() => (window.location.href = `/buyers/${b.id}/edit`)}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Pagination */}
      <div className="flex gap-2 mt-4">
        <button
          disabled={page <= 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          className="px-3 py-1 border rounded"
        >
          Prev
        </button>
        <span className="px-3 py-1">
          {page} / {totalPages}
        </span>
        <button
          disabled={page >= totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="px-3 py-1 border rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
}
