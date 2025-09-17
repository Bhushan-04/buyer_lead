"use client";

import { useEffect, useState } from "react";
import debounce from "lodash.debounce";
import AddBuyerForm from "./AddBuyerForm"; // modal form
import { getCurrentUser } from "@/lib/auth"; // demo auth util

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
    const [showModal, setShowModal] = useState(false);

    // ✅ Set client mount flag to avoid SSR mismatch
    useEffect(() => setIsClient(true), []);

    // Fetch buyers
    const fetchBuyers = async (query: string, filters: Record<string, string>, page: number) => {
        setLoading(true);
        const params = new URLSearchParams();
        if (query) params.append("search", query);
        Object.entries(filters).forEach(([k, v]) => {
            if (typeof v === "string" && v.trim() !== "") params.append(k, v);
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
        if (isClient) debouncedFetch(searchTerm, filters, page);
    }, [searchTerm, filters, page, isClient]);

    // ✅ Add Buyer handler for modal submission
    const handleBuyerAdded = async () => {
        setShowModal(false);
        await fetchBuyers(searchTerm, filters, page); // refresh table
    };

    if (!isClient) return <p>Loading buyers...</p>;

    return (
        <div className="space-y-4">
            <h1 className="text-xl font-bold">Buyers List</h1>

            {/* Filters */}
            <div className="flex flex-wrap gap-2 items-center">
                <input
                    type="text"
                    placeholder="Search by name, email, phone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="px-3 py-2 border rounded w-64"
                />
                <select value={filters.city || ""} onChange={(e) => setFilters(f => ({ ...f, city: e.target.value }))} className="px-3 py-2 border rounded">
                    <option value="">All Cities</option>
                    <option>Chandigarh</option>
                    <option>Mohali</option>
                    <option>Zirakpur</option>
                    <option>Panchkula</option>
                    <option>Other</option>
                </select>
                <select value={filters.propertyType || ""} onChange={(e) => setFilters(f => ({ ...f, propertyType: e.target.value }))} className="px-3 py-2 border rounded">
                    <option value="">All Property Types</option>
                    <option>Apartment</option>
                    <option>Villa</option>
                    <option>Plot</option>
                    <option>Office</option>
                    <option>Retail</option>
                </select>
                <select value={filters.status || ""} onChange={(e) => setFilters(f => ({ ...f, status: e.target.value }))} className="px-3 py-2 border rounded">
                    <option value="">All Status</option>
                    <option>New</option>
                    <option>Qualified</option>
                    <option>Contacted</option>
                    <option>Visited</option>
                    <option>Negotiation</option>
                    <option>Converted</option>
                    <option>Dropped</option>
                </select>
            </div>

            {/* Add Lead Button */}
            <div className="flex justify-between items-center mb-2">
                <button
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    onClick={() => setShowModal(true)}
                >
                    Add Lead
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
                                <td className="p-2 border">₹{(b.budgetMin || 0).toLocaleString()} - ₹{(b.budgetMax || 0).toLocaleString()}</td>
                                <td className="p-2 border">{b.timeline}</td>
                                <td className="p-2 border">{b.status}</td>
                                <td className="p-2 border">{new Date(b.updatedAt).toLocaleString()}</td>
                                <td className="p-2 border flex gap-2">
                                    <button className="px-2 py-1 bg-gray-300 rounded hover:bg-gray-400" onClick={() => (window.location.href = `/buyers/${b.id}`)}>View</button>
                                    <button className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700" onClick={() => (window.location.href = `/buyers/${b.id}/edit`)}>Edit</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {/* Pagination */}
            <div className="flex gap-2 mt-4">
                <button disabled={page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))} className="px-3 py-1 border rounded">Prev</button>
                <span className="px-3 py-1">Page {page} of {Math.ceil(count / pageSize)}</span>
                <button disabled={page >= Math.ceil(count / pageSize)} onClick={() => setPage(p => p + 1)} className="px-3 py-1 border rounded">Next</button>
            </div>

            {showModal && (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 overflow-auto p-4"
    onClick={() => setShowModal(false)}
  >
    <div
      className="bg-white rounded shadow-lg w-full max-w-2xl p-6 relative"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
        onClick={() => setShowModal(false)}
      >
        ✕
      </button>
      <AddBuyerForm
        onSuccess={() => {
          setShowModal(false);
          fetchBuyers(searchTerm, filters, page);
        }}
      />
    </div>
  </div>
)}


        </div>
    );
}
