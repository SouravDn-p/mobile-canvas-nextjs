import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import client from "@/lib/mongoClient";

export async function GET(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // ✅ Optional: Check if admin
  if (!token || token.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // const client = await clientPromise;
    const db = client.db("NextInvManager");
    const orders = await db
      .collection("Orders")
      .find()
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({ orders });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
