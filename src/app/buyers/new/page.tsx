"use client";

import { useState } from "react";
import { z } from "zod";

// Zod validation schema
const createBuyerSchema = z.object({
  fullName: z.string().min(2, "Full Name must be at least 2 characters"),
  phone: z.string().regex(/^\d{10,15}$/, "Phone must be 10–15 digits"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  city: z.string(),
  propertyType: z.string(),
  bhk: z.string().optional(),
  purpose: z.string(),
  budgetMin: z.number().optional(),
  budgetMax: z.number().optional(),
  timeline: z.string(),
  source: z.string(),
  notes: z.string().optional(),
  tags: z.array(z.string()).optional(),
}).refine((data) => {
  if (data.budgetMin != null && data.budgetMax != null) return data.budgetMax >= data.budgetMin;
  return true;
}, { message: "Budget Max must be ≥ Budget Min", path: ["budgetMax"] })
.refine((data) => {
  if (["Apartment", "Villa"].includes(data.propertyType)) return !!data.bhk;
  return true;
}, { message: "BHK is required for Apartment/Villa", path: ["bhk"] });

export default function AddBuyerForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    city: "",
    propertyType: "",
    bhk: "",
    purpose: "",
    budgetMin: "",
    budgetMax: "",
    timeline: "",
    source: "",
    notes: "",
    tags: [] as string[],
  });

  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    const parsedData = {
      ...formData,
      budgetMin: formData.budgetMin ? Number(formData.budgetMin) : undefined,
      budgetMax: formData.budgetMax ? Number(formData.budgetMax) : undefined,
    };

    const parsed = createBuyerSchema.safeParse(parsedData);

    if (!parsed.success) {
      setErrors(parsed.error.format() as any);
      setLoading(false);
      return;
    }

    const res = await fetch("/api/buyers/new", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed.data),
    });

    if (res.ok) {
      window.location.href = "/buyers"; // redirect after success
    } else {
      const err = await res.json().catch(() => ({}));
      alert("Error: " + JSON.stringify(err));
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-4 border rounded space-y-3">
      <h2 className="text-xl font-bold mb-2">Add Lead</h2>

      <div>
        <label>Full Name</label>
        <input
          className="border p-2 w-full rounded"
          value={formData.fullName}
          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
        />
        {errors.fullName && <p className="text-red-500">{errors.fullName.join(", ")}</p>}
      </div>

      <div>
        <label>Phone</label>
        <input
          className="border p-2 w-full rounded"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />
        {errors.phone && <p className="text-red-500">{errors.phone.join(", ")}</p>}
      </div>

      <div>
        <label>Email</label>
        <input
          className="border p-2 w-full rounded"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        {errors.email && <p className="text-red-500">{errors.email.join(", ")}</p>}
      </div>

      <div>
        <label>City</label>
        <select
          className="border p-2 w-full rounded"
          value={formData.city}
          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
        >
          <option value="">Select</option>
          <option>Chandigarh</option>
          <option>Mohali</option>
          <option>Zirakpur</option>
          <option>Panchkula</option>
          <option>Other</option>
        </select>
        {errors.city && <p className="text-red-500">{errors.city.join(", ")}</p>}
      </div>

      <div>
        <label>Property Type</label>
        <select
          className="border p-2 w-full rounded"
          value={formData.propertyType}
          onChange={(e) => setFormData({ ...formData, propertyType: e.target.value, bhk: "" })}
        >
          <option value="">Select</option>
          <option>Apartment</option>
          <option>Villa</option>
          <option>Plot</option>
          <option>Office</option>
          <option>Retail</option>
        </select>
        {errors.propertyType && <p className="text-red-500">{errors.propertyType.join(", ")}</p>}
      </div>

      {["Apartment", "Villa"].includes(formData.propertyType) && (
        <div>
          <label>BHK</label>
          <select
            className="border p-2 w-full rounded"
            value={formData.bhk}
            onChange={(e) => setFormData({ ...formData, bhk: e.target.value })}
          >
            <option value="">Select</option>
            <option>1</option>
            <option>2</option>
            <option>3</option>
            <option>4</option>
            <option>Studio</option>
          </select>
          {errors.bhk && <p className="text-red-500">{errors.bhk.join(", ")}</p>}
        </div>
      )}

      <div>
        <label>Purpose</label>
        <select
          className="border p-2 w-full rounded"
          value={formData.purpose}
          onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
        >
          <option value="">Select</option>
          <option>Buy</option>
          <option>Rent</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label>Budget Min</label>
          <input
            type="number"
            className="border p-2 w-full rounded"
            value={formData.budgetMin}
            onChange={(e) => setFormData({ ...formData, budgetMin: e.target.value })}
          />
        </div>
        <div>
          <label>Budget Max</label>
          <input
            type="number"
            className="border p-2 w-full rounded"
            value={formData.budgetMax}
            onChange={(e) => setFormData({ ...formData, budgetMax: e.target.value })}
          />
        </div>
      </div>

      <div>
        <label>Timeline</label>
        <select
          className="border p-2 w-full rounded"
          value={formData.timeline}
          onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
        >
          <option value="">Select</option>
          <option>0-3m</option>
          <option>3-6m</option>
          <option>&gt;6m</option>
          <option>Exploring</option>
        </select>
      </div>

      <div>
        <label>Source</label>
        <select
          className="border p-2 w-full rounded"
          value={formData.source}
          onChange={(e) => setFormData({ ...formData, source: e.target.value })}
        >
          <option value="">Select</option>
          <option>Website</option>
          <option>Referral</option>
          <option>Walk-in</option>
          <option>Call</option>
          <option>Other</option>
        </select>
      </div>

      <div>
        <label>Notes</label>
        <textarea
          className="border p-2 w-full rounded"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
        />
      </div>

      <div>
        <label>Tags (comma separated)</label>
        <input
          className="border p-2 w-full rounded"
          value={formData.tags.join(", ")}
          onChange={(e) =>
            setFormData({ ...formData, tags: e.target.value.split(",").map((t) => t.trim()) })
          }
        />
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        disabled={loading}
      >
        {loading ? "Saving..." : "Save Lead"}
      </button>
    </form>
  );
}
