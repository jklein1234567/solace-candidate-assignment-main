import db from "../../../db";
import { advocates } from "../../../db/schema";
import { advocateData } from "../../../db/seed/advocates";

export async function GET() {
  try {
    const data = await db.select().from(advocates);
    return Response.json({ data });
    // add error handling
  } catch (error) {
    console.error("GET /api/advocates error:", error);
    return Response.json({ error: "Unable to fetch advocates" }, { status: 500 });
  }
}
