import seed from "@/(server)/controllers/seed";
export async function GET() {
  try {
    await Promise.all([
      seed.seedUsers(),
      seed.seedCustomers(),
      seed.seedInvoices(),
      seed.seedRevenue(),
    ]);

    return Response.json({ message: "Database seeded successfully" });
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
