import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

let layouts: any[] = [];

export async function POST(req: Request) {
  const data = await req.json();
  const layout = { ...data, id: uuidv4() };
  layouts.push(layout);
  return NextResponse.json({ success: true, layout });
}

export async function GET() {
  return NextResponse.json(layouts);
}

export async function PUT(req: Request) {
  const data = await req.json();
  const { id, ...rest } = data;
  const idx = layouts.findIndex((l) => l.id === id);
  if (idx === -1)
    return NextResponse.json(
      { success: false, error: "Not found" },
      { status: 404 }
    );
  layouts[idx] = { ...layouts[idx], ...rest };
  return NextResponse.json({ success: true, layout: layouts[idx] });
}

export async function DELETE(req: Request) {
  const { id } = await req.json();
  const idx = layouts.findIndex((l) => l.id === id);
  if (idx === -1)
    return NextResponse.json(
      { success: false, error: "Not found" },
      { status: 404 }
    );
  layouts.splice(idx, 1);
  return NextResponse.json({ success: true });
}
