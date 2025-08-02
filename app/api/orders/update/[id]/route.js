import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import client from "@/lib/mongoClient";
import { ObjectId } from "mongodb";

export async function GET(req, { params }) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // ✅ Optional: Only admin or the owner can access
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = params;

  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid order ID" }, { status: 400 });
  }

  try {
    const db = client.db("NextInvManager");

    const order = await db
      .collection("Orders")
      .findOne({ _id: new ObjectId(id) });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // ✅ Optional: Check if user owns the order (if not admin)
    if (token.role !== "admin" && token.email !== order.email) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("Error fetching order by ID:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT /api/orders/[id]/route.js
export async function PUT(req, { params }) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // 🔒 Admin check
  if (!token || token.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = params;

  // ❗ Validate MongoDB ObjectId
  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid Order ID" }, { status: 400 });
  }

  try {
    const body = await req.json();

    // 🧪 Optional: Validate body fields
    const allowedFields = ["status", "payment", "shippingAddress", "updatedAt"];
    const updateData = {};
    for (const key of allowedFields) {
      if (body[key] !== undefined) {
        updateData[key] = body[key];
      }
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "No valid fields to update" },
        { status: 400 }
      );
    }

    const db = client.db("NextInvManager");

    const result = await db
      .collection("Orders")
      .updateOne({ _id: new ObjectId(id) }, { $set: updateData });

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Order updated successfully" });
  } catch (error) {
    console.error("Update error:", error); // 🐞 Debug log
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
