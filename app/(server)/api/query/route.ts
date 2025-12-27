import seed from "@/(server)/controllers/seed";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    return Response.json(await seed.listInvoices());
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
