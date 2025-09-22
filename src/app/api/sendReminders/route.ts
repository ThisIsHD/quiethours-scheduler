import { NextResponse } from "next/server";
import clientPromise from "@/app/lib/mongodb";
import { createClient } from "@supabase/supabase-js";
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface Block {
  _id: string;
  userId: string;
  title: string;
  date: string;
  startTime: string;
}

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("studytime");
    const collection = db.collection<Block>("blocks");

    const now = new Date();
    const in10Min = new Date(now.getTime() + 10 * 60 * 1000);
    const targetDate = in10Min.toISOString().slice(0, 10);
    const targetTime = in10Min.toTimeString().slice(0, 5);

    const blocks = await collection
      .find({ date: targetDate, startTime: targetTime })
      .toArray();

    for (const block of blocks) {
      const { data: user, error } = await supabase
        .from("users")
        .select("email")
        .eq("id", block.userId)
        .single();

      if (error || !user?.email) continue;

      const msg = {
        to: user.email,
        from: process.env.SENDGRID_SENDER!,
        subject: "Your study block starts in 10 minutes!",
        text: `Hi! Your study block "${block.title}" starts at ${block.startTime} on ${block.date}.`,
      };

      await sgMail.send(msg);
    }

    return NextResponse.json({ success: true, sent: blocks.length });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
