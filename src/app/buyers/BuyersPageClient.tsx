"use client";

import { useEffect, useState, useRef } from "react";
import debounce from "lodash.debounce";
import AddBuyerForm from "./components/AddBuyerForm";
import EditBuyerForm from "./components/EditBuyerForm";
import { Buyer } from "@/types";

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

  // Current logged in user
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBuyer, setSelectedBuyer] = useState<Buyer | null>(null);

  // Ref for file input
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() =>{
     setIsClient(true),
      fetchCurrentUser()    
,[]});

  // Fetch current user
  const fetchCurrentUser = async () => {
    try {
      const res = await fetch("/api/auth/demo");
      console.log(res);
      const data = await res.json();
      console.log("Current user", data.user);
      setCurrentUserId(data?.user?.id || null);
    } catch (err) {
      console.error("Failed to fetch user", err);
    }
  };

  // Fetch buyers
  const fetchBuyers = async (query: string, filters: Record<string, string>, page: number) => {
  setLoading(true);
  const params = new URLSearchParams();

  if (query.trim() !== "") params.append("search", query); // Only add search if not empty
  Object.entries(filters).forEach(([k, v]) => {
    if (k !== "search" && v.trim() !== "") params.append(k, v);
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
  if (!isClient) return;

  setPage(1); // Reset page on search/filter change
  debouncedFetch(searchTerm, filters, 1);
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [searchTerm, JSON.stringify(filters), isClient]); // stable dependency


  // Fetch single buyer
  const fetchBuyerById = async (id: string) => {
    const res = await fetch(`/api/buyers/${id}`);
    const data = await res.json();
    setSelectedBuyer(data);
  };

  const handleView = async (id: string) => {
    await fetchBuyerById(id);
    setShowViewModal(true);
  };

  const handleEdit = async (id: string) => {
    await fetchBuyerById(id);
    setShowEditModal(true);
  };

  const handleAddSuccess = async () => {
    setShowAddModal(false);
    await fetchBuyers(searchTerm, filters, page);
  };

  const handleEditSuccess = async () => {
    setShowEditModal(false);
    await fetchBuyers(searchTerm, filters, page);
  };

  const handleEditCancel = () => {};

  // Handle Delete
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this buyer?")) return;

    try {
      const res = await fetch(`/api/buyers/${id}`, { method: "DELETE" });
      if (res.ok) {
        await fetchBuyers(searchTerm, filters, page);
      } else {
        const err = await res.json();
        alert(err.error || "Failed to delete");
      }
    } catch (err) {
      console.error("Delete failed", err);
      alert("Delete failed!");
    }
  };

  // Import CSV
  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    try {
      const res = await fetch("/api/buyers/import", { method: "POST", body: formData });
      const data = await res.json();

      if (data.success) {
        alert(`${data.inserted} rows inserted successfully!`);
        await fetchBuyers(searchTerm, filters, page);
      } else {
        alert(
          `Errors:\n${data.errors
            .map((err: any) => `Row ${err.row}: ${err.message}`)
            .join("\n")}`
        );
      }
    } catch (err) {
      console.error(err);
      alert("Import failed!");
    }
    setLoading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Export CSV
  const handleExport = async () => {
    const params = new URLSearchParams();
    if (searchTerm) params.append("search", searchTerm);
    Object.entries(filters).forEach(([k, v]) => {
      if (typeof v === "string" && v.trim() !== "") params.append(k, v);
    });

    const res = await fetch(`/api/buyers/export?${params.toString()}`);
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "buyers.csv";
    a.click();
    window.URL.revokeObjectURL(url);
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
          onChange={(e) => {
  const value = e.target.value;
  setSearchTerm(value);
  setFilters((f) => ({ ...f, search: value })); // Sync search in filters
}}

          className="px-3 py-2 border rounded w-64"
        />
        <select
          value={filters.city || ""}
          onChange={(e) => setFilters((f) => ({ ...f, city: e.target.value }))}
          className="px-3 py-2 border rounded"
        >
          <option value="">All Cities</option>
          <option>Chandigarh</option>
          <option>Mohali</option>
          <option>Zirakpur</option>
          <option>Panchkula</option>
          <option>Other</option>
        </select>
        <select
          value={filters.propertyType || ""}
          onChange={(e) => setFilters((f) => ({ ...f, propertyType: e.target.value }))}
          className="px-3 py-2 border rounded"
        >
          <option value="">All Property Types</option>
          <option>Apartment</option>
          <option>Villa</option>
          <option>Plot</option>
          <option>Office</option>
          <option>Retail</option>
        </select>
        <select
          value={filters.status || ""}
          onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
          className="px-3 py-2 border rounded"
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
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center mb-2 gap-2">
        <button
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          onClick={() => setShowAddModal(true)}
        >
          Add Lead
        </button>

        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={handleExport}
        >
          Export CSV
        </button>

        <label className="bg-gray-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-gray-700">
          Import CSV
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            className="hidden"
            onChange={handleImport}
          />
        </label>
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
                <td className="p-2 border">
                  ₹{(b.budgetMin || 0).toLocaleString()} - ₹{(b.budgetMax || 0).toLocaleString()}
                </td>
                <td className="p-2 border">{b.timeline}</td>
                <td className="p-2 border">{b.status}</td>
                <td className="p-2 border">{new Date(b.updatedAt).toLocaleString()}</td>
                <td className="p-2 border flex gap-2">
                  <button
                    className="px-2 py-1 bg-gray-300 rounded hover:bg-gray-400"
                    onClick={() => handleView(b.id)}
                  >
                    View
                  </button>
                  {b.ownerId === currentUserId ? (
                    <>
                      <button
                        className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                        onClick={() => handleEdit(b.id)}
                      >
                        Edit
                      </button>
                      <button
                        className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                        onClick={() => handleDelete(b.id)}
                      >
                        Delete
                      </button>
                    </>
                  ) : (
                    <span className="text-gray-400">Read-only</span>
                  )}
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

      {/* Modals (Add / View / Edit) */}
      {showAddModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 overflow-auto p-4"
          onClick={() => setShowAddModal(false)}
        >
          <div
            className="bg-white rounded shadow-lg w-full max-w-2xl p-6 relative max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
              onClick={() => setShowAddModal(false)}
            >
              ✕
            </button>
            <AddBuyerForm onSuccess={handleAddSuccess} />
          </div>
        </div>
      )}

      {showViewModal && selectedBuyer && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 overflow-auto p-4"
          onClick={() => setShowViewModal(false)}
        >
          <div
            className="bg-white rounded shadow-lg w-full max-w-2xl p-6 relative max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
              onClick={() => setShowViewModal(false)}
            >
              ✕
            </button>
            <h2 className="text-lg font-bold mb-4">View Buyer</h2>
            <div className="space-y-2">
              {Object.entries(selectedBuyer).map(([key, value]) =>
                key !== "history" ? (
                  <div key={key}>
                    <strong>{key}:</strong> {value?.toString()}
                  </div>
                ) : null
              )}
            </div>
          </div>
        </div>
      )}

      {showEditModal && selectedBuyer && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 overflow-auto p-4"
          onClick={() => setShowEditModal(false)}
        >
          <div
            className="bg-white rounded shadow-lg w-full max-w-2xl p-6 relative max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
              onClick={() => setShowEditModal(false)}
            >
              ✕
            </button>
            <h2 className="text-lg font-bold mb-4">Edit Buyer</h2>
            <EditBuyerForm
              buyer={selectedBuyer}
              onSuccess={handleEditSuccess}
              onCancel={handleEditCancel}
            />
          </div>
        </div>
      )}
    </div>
  );
}
