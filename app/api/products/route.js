import { MongoClient, ServerApiVersion } from "mongodb";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

// MongoDB URI
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_KEY}@cluster0.pb8np.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// MongoDB client setup
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// GET method handler
export async function GET(req) {
  try {
    await client.connect();
    const db = client.db("NextInvManager");
    const productCollection = db.collection("Products");
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    // 🔒 Require authentication
    // if (!token) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    const products = await productCollection.find({}).toArray();

    return NextResponse.json({
      message: "success",
      status: 200,
      data: products,
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Failed to fetch products",
        error: error.message,
      },
      { status: 500 }
    );
  } finally {
    // Optional: Do not close the client for serverless functions
    // await client.close();
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      name,
      description,
      category,
      price,
      stock,
      sku,
      supplier,
      status,
      features,
      specifications,
      trending,
      isOnSale,
      originalPrice,
      images,
      image
    } = body;

    if (!name || !description || !price) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    await client.connect();
    const db = client.db("NextInvManager");
    const productCollection = db.collection("Products");

    const result = await productCollection.insertOne({
      name,
      description,
      category,
      price: parseFloat(price),
      stock,
      sku,
      supplier,
      status,
      specifications: Array.isArray(specifications) ? specifications : [],
      originalPrice: originalPrice ? parseFloat(originalPrice) : null,
      trending,
      isOnSale,
      images: Array.isArray(images) ? images : [],
      features: Array.isArray(features) ? features : [],
      rating: 4.5,
      reviews: [],
      sales: 0,
      dateAdded: new Date().toISOString(),
      image
    });

    return NextResponse.json({
      message: "Product created successfully",
      insertedId: result.insertedId,
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Failed to create product",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
