"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";

type Buyer = {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  city: string;
  propertyType: string;
  bhk: string;
  purpose: string;
  timeline: string;
  source: string;
  budgetMin: number;
  budgetMax: number;
  notes: string;
  status: string;
};

// Enums (must match schema)
const PROPERTY_TYPES = ["Apartment", "House", "Plot"];
const BHK_OPTIONS = ["ONE", "TWO", "THREE", "FOUR", "FIVE"];
const PURPOSE_OPTIONS = ["Buy", "Rent"];
const TIMELINE_OPTIONS = ["IMMEDIATE", "ONE_TO_3M", "THREE_TO_6M", "SIX_TO_12M", "ABOVE_12M"];
const SOURCE_OPTIONS = [
  { value: "Website", label: "Website" },
  { value: "Referral", label: "Referral" },
  { value: "WalkIn", label: "Walk-in" },
  { value: "Call", label: "Call" },
  { value: "Other", label: "Other" },
];
const STATUS_OPTIONS = ["New", "Contacted", "Interested", "Closed", "Lost"];

export default function EditBuyerPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const { id } = params as { id: string };

  const from = searchParams.get("from"); // "view" or "list"

  const [buyer, setBuyer] = useState<Buyer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBuyer = async () => {
      const res = await fetch(`/api/buyers/${id}`);
      const data = await res.json();
      setBuyer(data);
      setLoading(false);
    };
    fetchBuyer();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    if (!buyer) return;
    setBuyer({ ...buyer, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyer) return;

    const res = await fetch(`/api/buyers/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(buyer),
    });

    if (res.ok) {
      if (from === "view") {
        router.push(`/buyers/${id}`);
      } else {
        router.push("/buyers");
      }
    } else {
      alert("Update failed");
    }
  };

  const handleCancel = () => {
    if (from === "view") {
      router.push(`/buyers/${id}`);
    } else {
      router.push("/buyers");
    }
  };

  if (loading) return <p className="p-4">Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Edit Buyer</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <div>
          <label className="block font-medium">Full Name</label>
          <input
            name="fullName"
            value={buyer?.fullName || ""}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block font-medium">Phone</label>
          <input
            name="phone"
            value={buyer?.phone || ""}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={buyer?.email || ""}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
        </div>

        {/* City */}
        <div>
          <label className="block font-medium">City</label>
          <input
            name="city"
            value={buyer?.city || ""}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
        </div>

        {/* Property Type */}
        <div>
          <label className="block font-medium">Property Type</label>
          <select
            name="propertyType"
            value={buyer?.propertyType || ""}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          >
            {PROPERTY_TYPES.map((val) => (
              <option key={val} value={val}>
                {val}
              </option>
            ))}
          </select>
        </div>

        {/* BHK */}
        <div>
          <label className="block font-medium">BHK</label>
          <select
            name="bhk"
            value={buyer?.bhk || ""}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          >
            {BHK_OPTIONS.map((val) => (
              <option key={val} value={val}>
                {val}
              </option>
            ))}
          </select>
        </div>

        {/* Purpose */}
        <div>
          <label className="block font-medium">Purpose</label>
          <select
            name="purpose"
            value={buyer?.purpose || ""}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          >
            {PURPOSE_OPTIONS.map((val) => (
              <option key={val} value={val}>
                {val}
              </option>
            ))}
          </select>
        </div>

        {/* Timeline */}
        <div>
          <label className="block font-medium">Timeline</label>
          <select
            name="timeline"
            value={buyer?.timeline || ""}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          >
            {TIMELINE_OPTIONS.map((val) => (
              <option key={val} value={val}>
                {val}
              </option>
            ))}
          </select>
        </div>

        {/* Source */}
        <div>
          <label className="block font-medium">Source</label>
          <select
            name="source"
            value={buyer?.source || ""}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          >
            {SOURCE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Budget Min */}
        <div>
          <label className="block font-medium">Budget Min</label>
          <input
            type="number"
            name="budgetMin"
            value={buyer?.budgetMin || ""}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
        </div>

        {/* Budget Max */}
        <div>
          <label className="block font-medium">Budget Max</label>
          <input
            type="number"
            name="budgetMax"
            value={buyer?.budgetMax || ""}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
        </div>

        {/* Notes */}
        <div>
          <label className="block font-medium">Notes</label>
          <textarea
            name="notes"
            value={buyer?.notes || ""}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
        </div>

        {/* Status */}
        <div>
          <label className="block font-medium">Status</label>
          <select
            name="status"
            value={buyer?.status || ""}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          >
            {STATUS_OPTIONS.map((val) => (
              <option key={val} value={val}>
                {val}
              </option>
            ))}
          </select>
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            Save
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
