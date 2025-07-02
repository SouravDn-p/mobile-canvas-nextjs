import { MongoClient, ServerApiVersion } from "mongodb";
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
export async function GET() {
  try {
    await client.connect();
    const db = client.db("NextInvManager");
    const productCollection = db.collection("Products");

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
      specifications,
      images,
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
      price,
      stock,
      sku,
      supplier,
      status,
      specifications,
      images,

      price: parseFloat(price),
      createdAt: new Date(),
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
