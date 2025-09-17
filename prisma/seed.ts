import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create a demo user
  const user = await prisma.user.create({
    data: {
      id: "demo-user-1", // so we know the id
      email: "demo@example.com",
      name: "Demo User",
    },
  });

  // Now create a buyer that belongs to that user
  await prisma.buyer.create({
    data: {
      fullName: "Jane Doe",
      email: "jane@example.com",
      phone: "9876543210",
      city: "Chandigarh",
      propertyType: "Apartment",
      bhk: "Two",
      purpose: "Buy",
      budgetMin: 4000000,
      budgetMax: 6000000,
      source: "Website",
      status: "New",
      notes: "Wants a good school nearby",
      tags: ["priority"],
      ownerId: user.id, // ✅ FK is valid now
    },
  });

  console.log("✅ Seed complete");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
