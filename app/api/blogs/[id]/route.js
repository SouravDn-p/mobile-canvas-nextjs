import { NextResponse } from "next/server";
import { MongoClient, ObjectId, ServerApiVersion } from "mongodb";

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

// GET: Fetch a blog by ID
export async function GET(request, { params }) {
  try {
    const { id } = params;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid blog ID" },
        { status: 400 }
      );
    }

    const collection = await getBlogCollection();
    const blog = await collection.findOne({ _id: new ObjectId(id) });

    if (!blog) {
      return NextResponse.json(
        { success: false, error: "Blog not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, blog });
  } catch (error) {
    console.error("GET error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch blog" },
      { status: 500 }
    );
  }
}

// PUT: Update a blog by ID (handles all updates: likes, comments, views, shares, content)
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const updates = await request.json();

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid blog ID" },
        { status: 400 }
      );
    }

    const collection = await getBlogCollection();

    // Handle different types of updates
    let updateOperation = {};

    // If it's a comment addition
    if (updates.addComment) {
      const { content, author, authorId, replyTo } = updates.addComment;

      if (!content || !author) {
        return NextResponse.json(
          { success: false, error: "Missing comment fields" },
          { status: 400 }
        );
      }

      const newComment = {
        id: new ObjectId().toString(),
        author,
        authorId,
        content,
        createdAt: new Date().toISOString(),
        replyTo: replyTo || null,
        likes: 0,
      };

      updateOperation = {
        $push: { comments: newComment },
        $set: { updatedAt: new Date() },
      };
    }
    // If it's a view increment
    else if (updates.incrementViews) {
      updateOperation = {
        $inc: { views: 1 },
        $set: { updatedAt: new Date() },
      };
    }
    // If it's a like/unlike operation
    else if (updates.toggleLike) {
      const { userId, isLiking } = updates.toggleLike;

      if (isLiking) {
        updateOperation = {
          $inc: { likes: 1 },
          $addToSet: { likedBy: userId },
          $set: { updatedAt: new Date() },
        };
      } else {
        updateOperation = {
          $inc: { likes: -1 },
          $pull: { likedBy: userId },
          $set: { updatedAt: new Date() },
        };
      }
    }
    // If it's a bookmark toggle
    else if (updates.toggleBookmark) {
      const { userId, isBookmarking } = updates.toggleBookmark;

      if (isBookmarking) {
        updateOperation = {
          $addToSet: { bookmarkedBy: userId },
          $set: { updatedAt: new Date() },
        };
      } else {
        updateOperation = {
          $pull: { bookmarkedBy: userId },
          $set: { updatedAt: new Date() },
        };
      }
    }
    // Regular content update
    else {
      // If content is being updated, recalculate read time
      if (updates.content) {
        const wordCount = updates.content.split(" ").length;
        updates.readTime = Math.ceil(wordCount / 200);
      }

      updateOperation = {
        $set: {
          ...updates,
          updatedAt: new Date(),
        },
      };
    }

    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      updateOperation,
      {
        returnDocument: "after",
      }
    );

    if (!result.value) {
      return NextResponse.json(
        { success: false, error: "Blog not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      blog: result.value,
      message: "Blog updated successfully",
    });
  } catch (error) {
    console.error("PUT error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update blog" },
      { status: 500 }
    );
  }
}

// DELETE: Delete a blog by ID
export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid blog ID" },
        { status: 400 }
      );
    }

    const collection = await getBlogCollection();
    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: "Blog not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Blog deleted successfully",
    });
  } catch (error) {
    console.error("DELETE error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete blog" },
      { status: 500 }
    );
  }
}
