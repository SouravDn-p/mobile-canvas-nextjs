// app/api/auth/register/route.js
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs"; // updated
import client from "@/lib/mongoClient";

export async function POST(req) {
  const { name, email, password } = await req.json();

  if (!name || !email || !password) {
    return NextResponse.json(
      { error: "All fields are required" },
      { status: 400 }
    );
  }

  const db = client.db("NextInvManager");
  const userExists = await db.collection("Users").findOne({ email });

  if (userExists) {
    return NextResponse.json({ error: "User already exists" }, { status: 409 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await db.collection("Users").insertOne({
    name,
    email,
    password: hashedPassword,
    role: "user",
    createdAt: new Date(),
  });

  return NextResponse.json(
    { message: "User registered successfully" },
    { status: 201 }
  );
}
