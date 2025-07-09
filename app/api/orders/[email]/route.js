import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import client from "@/lib/mongoClient";

export async function GET(req, context) {
  const { params } = context;
  const email = params.email;

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token || token.email !== email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const db = client.db("NextInvManager");
    const orders = await db
      .collection("Orders")
      .find({ email })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({ orders });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
