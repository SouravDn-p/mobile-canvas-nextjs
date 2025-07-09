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
  const { params } = context;
  const email = params?.email;

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // 🔒 Check authorization
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (email !== token.email) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await req.json();

    // ✅ Pick only allowed fields to update
    const updateFields = {};

    // Basic user profile
    if (body.name) updateFields.name = body.name;
    if (body.phone) updateFields.phone = body.phone;
    if (body.bio) updateFields.bio = body.bio;
    if (body.department) updateFields.department = body.department;
    if (body.location) updateFields.location = body.location;
    if (body.website) updateFields.website = body.website;

    // Cart & Wishlist
    if (body.cart) updateFields.cart = body.cart;
    if (body.wishlist) updateFields.wishlist = body.wishlist;

    if (Object.keys(updateFields).length === 0) {
      return NextResponse.json(
        { message: "No valid fields to update" },
        { status: 400 }
      );
    }

    updateFields.updatedAt = new Date();

    const client = await clientPromise;
    const db = client.db("NextInvManager");
    const users = db.collection("Users");

    const result = await users.updateOne(
      { email },
      { $set: updateFields },
      { upsert: false }
    );

    return NextResponse.json({
      message: "User updated successfully",
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
