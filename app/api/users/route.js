import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import client from "@/lib/mongoClient";

export async function GET(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // 🔐 Step 1: Check Auth
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 🔐 Step 2: Check Admin Role
  if (token.role !== "admin") {
    return NextResponse.json(
      { error: "Forbidden: Admins only" },
      { status: 403 }
    );
  }

  try {
    const db = client.db("NextInvManager");
    const users = await db
      .collection("Users")
      .find({})
      .project({ password: 0 }) // never expose password if exists
      .toArray();

    return NextResponse.json({ users }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
