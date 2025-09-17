import BuyersPageClient from "./BuyersPageClient";

export default async function BuyersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const pageSize = 10;

  // Convert searchParams safely
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((v) => query.append(key, v));
    } else if (value) {
      query.append(key, value);
    }
  });

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

  const res = await fetch(`http://localhost:3000/api/buyers?${query.toString()}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error("API Error:", res.status, errText);
    throw new Error(`Failed to fetch buyers: ${res.status}`);
  }

  const data = await res.json();

  return (
    <BuyersPageClient
      initialRows={data.rows}
      initialCount={data.count}
      initialPage={parseInt((params.page as string) || "1")}
      pageSize={pageSize}
      initialFilters={Object.fromEntries(query.entries())}
    />
  );
}
