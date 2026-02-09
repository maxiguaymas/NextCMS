import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role === "VIEWER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const data = await req.json();

  const post = await prisma.post.create({
    data: {
      title: data.title,
      content: data.content,
      status: data.status,
      slug: data.title.toLowerCase().replace(/\s+/g, "-"),
      author: { connect: { email: session.user?.email! } },
    },
  });

  return NextResponse.json(post);
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role === "VIEWER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const data = await req.json();

  const post = await prisma.post.update({
    where: { id: data.id },
    data: {
      title: data.title,
      content: data.content,
      status: data.status,
    },
  });

  return NextResponse.json(post);
}
