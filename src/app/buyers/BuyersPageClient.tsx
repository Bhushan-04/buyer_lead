"use client";

import { useEffect, useState } from "react";
import debounce from "lodash.debounce";

type Buyer = {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  city: string;
  propertyType: string;
  bhk?: string;
  purpose?: string;
  budgetMin?: number;
  budgetMax?: number;
  timeline: string;
  status: string;
  updatedAt: string;
};

export default function BuyersPageClient({
  initialRows,
  initialCount,
  initialPage,
  pageSize,
  initialFilters,
}: {
  initialRows: Buyer[];
  initialCount: number;
  initialPage: number;
  pageSize: number;
  initialFilters: Record<string, string>;
}) {
  const [buyers, setBuyers] = useState<Buyer[]>(initialRows);
  const [count, setCount] = useState(initialCount);
  const [page, setPage] = useState(initialPage);
  const [filters, setFilters] = useState<Record<string, string>>(initialFilters);
  const [searchTerm, setSearchTerm] = useState(initialFilters.search || "");
  const [loading, setLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // ✅ Set client mount flag to avoid SSR mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fetch buyers with current filters
  const fetchBuyers = async (query: string, filters: Record<string, string>, page: number) => {
    setLoading(true);
    const params = new URLSearchParams();

    if (query) params.append("search", query);

    Object.entries(filters).forEach(([k, v]) => {
      if (typeof v === "string" && v.trim() !== "") {
        params.append(k, v);
      }
    });

    params.append("page", String(page));
    params.append("pageSize", String(pageSize));

    const res = await fetch(`/api/buyers?${params.toString()}`);
    const data = await res.json();
    setBuyers(data.rows);
    setCount(data.count);
    setLoading(false);
  };

  const debouncedFetch = debounce(fetchBuyers, 400);

  useEffect(() => {
    if (isClient) {
      debouncedFetch(searchTerm, filters, page);
    }
  }, [searchTerm, filters, page, isClient]);

  // ✅ Only render table after client mount
  if (!isClient) return <p>Loading buyers...</p>;

  return (
    <div className="space-y-4">
      {/* 🔎 Search + Filters */}
      <div className="flex flex-wrap gap-2 items-center">
        <input
          type="text"
          placeholder="Search by name, email, phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-3 py-2 border rounded w-64"
        />

        <select
          value={filters.city || ""}
          onChange={(e) => setFilters((f) => ({ ...f, city: e.target.value }))}
          className="px-3 py-2 border rounded"
        >
          <option value="">All Cities</option>
          <option value="Chandigarh">Chandigarh</option>
          <option value="Mohali">Mohali</option>
          <option value="Zirakpur">Zirakpur</option>
          <option value="Panchkula">Panchkula</option>
          <option value="Other">Other</option>
        </select>

        <select
          value={filters.propertyType || ""}
          onChange={(e) => setFilters((f) => ({ ...f, propertyType: e.target.value }))}
          className="px-3 py-2 border rounded"
        >
          <option value="">All Property Types</option>
          <option value="Apartment">Apartment</option>
          <option value="Villa">Villa</option>
          <option value="Plot">Plot</option>
          <option value="Office">Office</option>
          <option value="Retail">Retail</option>
        </select>

        <select
          value={filters.status || ""}
          onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
          className="px-3 py-2 border rounded"
        >
          <option value="">All Status</option>
          <option value="New">New</option>
          <option value="Qualified">Qualified</option>
          <option value="Contacted">Contacted</option>
          <option value="Visited">Visited</option>
          <option value="Negotiation">Negotiation</option>
          <option value="Converted">Converted</option>
          <option value="Dropped">Dropped</option>
        </select>
      </div>

      // inside BuyersPageClient, above the table
<div className="flex justify-between items-center mb-2">
  <h1 className="text-xl font-bold">Buyers</h1>
  <button
    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
    onClick={() => (window.location.href = "/buyers/new")}
  >
    Add Lead
  </button>
</div>


      {/* 📋 Table */}
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
              <th className="p-2 border">Email</th>
              <th className="p-2 border">City</th>
              <th className="p-2 border">PropertyType</th>
              <th className="p-2 border">BHK</th>
              <th className="p-2 border">Purpose</th>
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
                <td className="p-2 border">{b.email}</td>
                <td className="p-2 border">{b.city}</td>
                <td className="p-2 border">{b.propertyType}</td>
                <td className="p-2 border">{b.bhk}</td>
                <td className="p-2 border">{b.purpose}</td>
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

      {/* 📌 Pagination */}
      <div className="flex gap-2 mt-4">
        <button
          disabled={page <= 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          className="px-3 py-1 border rounded"
        >
          Prev
        </button>
        <span className="px-3 py-1">
          Page {page} of {Math.ceil(count / pageSize)}
        </span>
        <button
          disabled={page >= Math.ceil(count / pageSize)}
          onClick={() => setPage((p) => p + 1)}
          className="px-3 py-1 border rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
}
