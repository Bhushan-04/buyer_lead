"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Buyer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  budget?: number;
  timeline: string;
};

export default function BuyerDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [buyer, setBuyer] = useState<Buyer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBuyer = async () => {
      try {
        const res = await fetch(`/api/buyers/${id}`);
        const data = await res.json();
        setBuyer(data);
      } catch (err) {
        console.error("Error fetching buyer:", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchBuyer();
  }, [id]);

  if (loading) return <p className="p-6">Loading buyer...</p>;
  if (!buyer) return <p className="p-6 text-red-500">Buyer not found.</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Buyer Details</h1>
      <div className="space-y-2 mb-6">
        <p><strong>Name:</strong> {buyer.name}</p>
        <p><strong>Email:</strong> {buyer.email}</p>
        <p><strong>Phone:</strong> {buyer.phone}</p>
        <p>
          <strong>Budget:</strong>{" "}
          {buyer.budget !== undefined
            ? `₹${buyer.budget.toLocaleString()}`
            : "Not specified"}
        </p>
        <p><strong>Timeline:</strong> {buyer.timeline}</p>
      </div>

      {/* Action buttons */}
      <div className="flex gap-4">
        <button
          onClick={() => router.push("/buyers")}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
        >
          Back
        </button>
        <button
          onClick={() => router.push(`/buyers/${buyer.id}/edit?from=view`)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Edit
        </button>
      </div>
    </div>
  );
}
