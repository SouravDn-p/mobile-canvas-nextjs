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

export async function POST(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { order } = body;

    const {
      items,
      total,
      status,
      payment,
      shippingAddress,
      paymentMethod,
      createdAt,
    } = order;

    // Validation
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Invalid items data" },
        { status: 400 }
      );
    }

    if (!total || !shippingAddress || !paymentMethod) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const db = client.db("NextInvManager");

    const newOrder = {
      email: token.email,
      items,
      total,
      status: status || "processing",
      payment: payment || "pending",
      shippingAddress,
      paymentMethod,
      createdAt: createdAt ? new Date(createdAt) : new Date(),
    };

    const result = await db.collection("Orders").insertOne(newOrder);

    return NextResponse.json({
      message: "Order placed successfully",
      orderId: result.insertedId,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
