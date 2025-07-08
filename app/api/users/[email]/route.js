import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongoClient";

export async function GET(req, context) {
  const { params } = await context;
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const email = params.email;

  if (email !== token.email) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const client = await clientPromise;
    const db = client.db("NextInvManager");
    const users = db.collection("Users");

    const user = await users.findOne({ email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req, context) {
  const { params } = await context;
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const email = params?.email;
  console.log("params", params.email);
  console.log("token", token?.email);

  if (email !== token.email) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await req.json();

    const client = await clientPromise;
    const db = client.db("NextInvManager");
    const users = db.collection("Users");

    const result = await users.updateOne({ email }, { $set: body });

    return NextResponse.json({
      message: "User updated",
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
