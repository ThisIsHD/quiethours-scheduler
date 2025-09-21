import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/app/lib/mongodb";

export async function POST(req: NextRequest) {
  try {
    const { userId, title, date, dayName, startTime, endTime } = await req.json();

    if (!userId || !title || !date || !dayName || !startTime || !endTime) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("studytime");
    const collection = db.collection("blocks");

    const result = await collection.insertOne({ userId, title, date, dayName, startTime, endTime, createdAt: new Date() });

    return NextResponse.json(result, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId"); 

    const client = await clientPromise;
    const db = client.db("studytime");
    const collection = db.collection("blocks");

    const query = userId ? { userId } : {}; 
    const blocks = await collection.find(query).sort({ createdAt: -1 }).toArray();
    const cleanBlocks = blocks.map((b) => ({
      _id: b._id.toString(),
      userId: b.userId,
      title: b.title,
      date: b.date,
      dayName: b.dayName,
      startTime: b.startTime,
      endTime: b.endTime,
      createdAt: b.createdAt instanceof Date
        ? b.createdAt.toISOString()
        : new Date(b.createdAt.$date).toISOString(),
    }));

    return NextResponse.json(cleanBlocks);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
