import db from "../../../db";
import { advocates } from "../../../db/schema";
import { advocateData } from "../../../db/seed/advocates";

export async function POST() {
  try {
    const records = await db.insert(advocates).values(advocateData).returning();
    return Response.json({ advocates: records }, { status: 201 });

    // add error handling
  } catch (error) {
    console.error("Seed error:", error);
    return Response.json({ error: "Failed to seed data" }, { status: 500 });
  }
}
