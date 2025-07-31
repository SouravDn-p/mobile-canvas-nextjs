import { NextResponse } from "next/server";
import { MongoClient, ServerApiVersion } from "mongodb";

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_KEY}@cluster0.pb8np.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function getBlogCollection() {
  await client.connect();
  const db = client.db("NextInvManager");
  return db.collection("Blogs");
}

// GET: Fetch all blogs
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Number.parseInt(searchParams.get("page") || "1");
    const limit = Number.parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const status = searchParams.get("status") || "published";
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    const collection = await getBlogCollection();

    // Build query
    const query = {};
    if (status) query.status = status;
    if (category) query.category = category;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
        { author: { $regex: search, $options: "i" } },
      ];
    }

    // Build sort
    const sort = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    const skip = (page - 1) * limit;

    const [blogs, total] = await Promise.all([
      collection.find(query).sort(sort).skip(skip).limit(limit).toArray(),
      collection.countDocuments(query),
    ]);

    return NextResponse.json({
      success: true,
      blogs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("GET blogs error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch blogs" },
      { status: 500 }
    );
  }
}

// POST: Create a new blog
export async function POST(request) {
  try {
    const body = await request.json();
    const {
      title,
      content,
      author,
      authorId,
      category,
      tags,
      image,
      status = "draft",
    } = body;

    // Validation
    if (!title || !content || !author) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const collection = await getBlogCollection();

    // Calculate read time (average 200 words per minute)
    const wordCount = content.split(" ").length;
    const readTime = Math.ceil(wordCount / 200);

    const newBlog = {
      title,
      content,
      author,
      authorId,
      category: category || "General",
      tags: tags || [],
      image: image || null,
      status,
      views: 0,
      likes: 0,
      likedBy: [],
      bookmarkedBy: [],
      comments: [],
      readTime,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await collection.insertOne(newBlog);

    return NextResponse.json({
      success: true,
      blog: { ...newBlog, _id: result.insertedId },
      message: "Blog created successfully",
    });
  } catch (error) {
    console.error("POST blog error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create blog" },
      { status: 500 }
    );
  }
}
