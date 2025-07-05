import { NextResponse } from "next/server";

let layouts: any[] = [];

export async function POST(req: Request) {
  const data = await req.json();
  layouts.push(data);
  return NextResponse.json({ success: true });
}

export async function GET() {
  return NextResponse.json(layouts);
}
