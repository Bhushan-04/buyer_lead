"use client";

import { useState } from "react";
import { Buyer } from "@/types";

export default function EditBuyerForm({
  buyer,
  onSuccess,
  onCancel,
}: {
  buyer: Buyer;
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    fullName: buyer.fullName || "",
    phone: buyer.phone || "",
    email: buyer.email || "",
    city: buyer.city || "",
    propertyType: buyer.propertyType || "",
    bhk: buyer.bhk || "",
    purpose: buyer.purpose || "",
    budgetMin: buyer.budgetMin || 0,
    budgetMax: buyer.budgetMax || 0,
    timeline: buyer.timeline || "",
    status: buyer.status || "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`/api/buyers/${buyer.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          updatedAt: buyer.updatedAt, // 👈 concurrency check
        }),
      });

      if (res.ok) {
        onSuccess();
      } else {
        const err = await res.json();
        alert(err.error || "Failed to update buyer");
      }
    } catch (error) {
      console.error(error);
      alert("Unexpected error updating buyer");
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block font-medium">Full Name</label>
        <input
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />
      </div>

      <div>
        <label className="block font-medium">Phone</label>
        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <div>
        <label className="block font-medium">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <div>
        <label className="block font-medium">City</label>
        <select
          name="city"
          value={formData.city}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="">Select City</option>
          <option>Chandigarh</option>
          <option>Mohali</option>
          <option>Zirakpur</option>
          <option>Panchkula</option>
          <option>Other</option>
        </select>
      </div>

      <div>
        <label className="block font-medium">Property Type</label>
        <select
          name="propertyType"
          value={formData.propertyType}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="">Select Type</option>
          <option>Apartment</option>
          <option>Villa</option>
          <option>Plot</option>
          <option>Office</option>
          <option>Retail</option>
        </select>
      </div>

      <div>
        <label className="block font-medium">BHK</label>
        <input
          type="text"
          name="bhk"
          value={formData.bhk}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <div>
        <label className="block font-medium">Purpose</label>
        <input
          type="text"
          name="purpose"
          value={formData.purpose}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <div className="flex gap-2">
        <div className="flex-1">
          <label className="block font-medium">Budget Min</label>
          <input
            type="number"
            name="budgetMin"
            value={formData.budgetMin}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div className="flex-1">
          <label className="block font-medium">Budget Max</label>
          <input
            type="number"
            name="budgetMax"
            value={formData.budgetMax}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
      </div>

      <div>
        <label className="block font-medium">Timeline</label>
        <input
          type="text"
          name="timeline"
          value={formData.timeline}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <div>
        <label className="block font-medium">Status</label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="">Select Status</option>
          <option>New</option>
          <option>Qualified</option>
          <option>Contacted</option>
          <option>Visited</option>
          <option>Negotiation</option>
          <option>Converted</option>
          <option>Dropped</option>
        </select>
      </div>

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border rounded hover:bg-gray-100"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
}
