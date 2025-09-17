"use client";

import { useState } from "react";

export default function BuyersToolbar({ filters, search }: { filters: any; search: string }) {
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    setExporting(true);
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value as string);
      });
      if (search) params.append("search", search);

      const res = await fetch(`/api/buyers/export?${params.toString()}`);
      if (!res.ok) throw new Error("Export failed");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "buyers.xlsx";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Export failed");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="flex justify-end mb-4">
      <button
        onClick={handleExport}
        disabled={exporting}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
      >
        {exporting ? "Exporting..." : "Export Excel"}
      </button>
    </div>
  );
}
