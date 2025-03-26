import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    console.log("Starting PDF creation process...");

    // Verify database connection
    try {
      await prisma.$connect();
      console.log("Database connection verified");
    } catch (dbError) {
      console.error("Database connection error:", dbError);
      return NextResponse.json(
        { error: "Database connection failed" },
        { status: 500 }
      );
    }

    const session = await getServerSession(authOptions);
    console.log("Session:", session);

    if (!session?.user?.email) {
      console.log("No session or email found");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, description, content } = await request.json();
    console.log("Received data:", { title, description, content });

    if (!title) {
      console.log("Title is missing");
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    console.log("Finding user with email:", session.user.email);
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      console.log("User not found for email:", session.user.email);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    console.log("Creating PDF for user:", user.id);
    try {
      const pdf = await prisma.PDF.create({
        data: {
          title,
          description,
          content,
          userId: user.id,
        },
      });
      console.log("PDF created successfully:", pdf.id);
      return NextResponse.json(pdf);
    } catch (dbError) {
      console.error("Database error:", dbError);
      return NextResponse.json(
        { error: "Database error: " + (dbError as Error).message },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error in PDF creation:", error);
    return NextResponse.json(
      { error: "Failed to create PDF: " + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("Finding user with email:", session.user.email);
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        pdfs: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!user) {
      console.log("User not found");
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    console.log("Found PDFs for user:", user.pdfs.length);
    return NextResponse.json(user.pdfs);
  } catch (error) {
    console.error("Error fetching PDFs:", error);
    return NextResponse.json(
      { error: "Failed to fetch PDFs" },
      { status: 500 }
    );
  }
}
