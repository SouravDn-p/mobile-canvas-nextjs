import { MongoClient, ObjectId, ServerApiVersion } from "mongodb";
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

// GET handler for single product by ID
export async function GET(req, context) {
  const { params } = await context;
  const { id } = params;

  try {
    await client.connect();
    const db = client.db("NextInvManager");
    const productCollection = db.collection("Products");

    // Convert string ID to ObjectId
    const product = await productCollection.findOne({ _id: new ObjectId(id) });

    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "success",
      status: 200,
      data: product,
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Failed to fetch product",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// PUT: Update a product
export async function PUT(request, { params }) {
  try {
    const id = params.id;
    const updatedData = await request.json();

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid product ID" },
        { status: 400 }
      );
    }

    await client.connect();
    const db = client.db("NextInvManager");
    const productCollection = db.collection("Products");

    const result = await productCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...updatedData, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Product updated successfully",
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to update product", error: error.message },
      { status: 500 }
    );
  }
}

// DELETE: Delete a product
export async function DELETE(request, { params }) {
  try {
    const id = params.id;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid product ID" },
        { status: 400 }
      );
    }

    await client.connect();
    const db = client.db("NextInvManager");
    const productCollection = db.collection("Products");

    const result = await productCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to delete product", error: error.message },
      { status: 500 }
    );
  }
}
