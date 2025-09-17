"use client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  async function handleLogin(userId: string) {
    const res = await fetch("/api/auth/demo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });

    if (res.ok) {
      router.push("/buyers");
    } else {
      const { error } = await res.json();
      alert("Login failed: " + error);
    }
  }

  return (
    <div className="flex flex-col gap-4 items-center justify-center min-h-screen">
      <h1 className="text-xl font-bold">Demo Login</h1>
      <button
        onClick={() => handleLogin("alice")}
        className="px-4 py-2 rounded bg-blue-500 text-white"
      >
        Login as Alice
      </button>
      <button
        onClick={() => handleLogin("bob")}
        className="px-4 py-2 rounded bg-green-500 text-white"
      >
        Login as Bob
      </button>
    </div>
  );
}
