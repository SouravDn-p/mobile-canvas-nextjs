import Link from "next/link";
import React from "react";

export default function Blogs() {
  const blogs = [
    {
      id: 1,
      title: "title 1",
      description: "description 1",
    },
    {
      id: 2,
      title: "title 2",
      description: "description 2",
    },
  ];
  return (
    <div>
      <main className="p-10">
        <h1 className="text-3xl py-6">Blogs</h1>
        {blogs.map((b) => (
          <Link key={b.id} href={`/blogs/${b.id}`}>
            <ul className="py-2 text-xl">{b.title}</ul>
          </Link>
        ))}
      </main>
    </div>
  );
}
