"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function HomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/demo", { method: "POST" });
      if (!res.ok) throw new Error("Demo login failed");

      const data = await res.json();
      // Save user in localStorage (or context later)
      localStorage.setItem("demoUser", JSON.stringify(data.user));

      router.push("/buyers"); // redirect to buyers page
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-3xl font-bold">Welcome to Buyer Lead App</h1>
      <p>Click below to login as Demo User and start adding leads</p>

      {error && <p className="text-red-500">{error}</p>}

      <button
        onClick={handleLogin}
        disabled={loading}
        className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Logging in..." : "Login as Demo User"}
      </button>
    </div>
  );
}
