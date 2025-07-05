import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { promises as fs } from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "src/app/api/layouts/layouts.json");

async function readLayouts() {
  try {
    const data = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function writeLayouts(layouts: any[]) {
  await fs.writeFile(DATA_FILE, JSON.stringify(layouts, null, 2), "utf-8");
}

export async function POST(req: Request) {
  const data = await req.json();
  const layouts = await readLayouts();
  const layout = { ...data, id: uuidv4() };
  layouts.push(layout);
  await writeLayouts(layouts);
  return NextResponse.json({ success: true, layout });
}

export async function GET() {
  const layouts = await readLayouts();
  return NextResponse.json(layouts);
}

export async function PUT(req: Request) {
  const data = await req.json();
  const { id, ...rest } = data;
  const layouts = await readLayouts();
  const idx = layouts.findIndex((l: any) => l.id === id);
  if (idx === -1)
    return NextResponse.json(
      { success: false, error: "Not found" },
      { status: 404 }
    );
  layouts[idx] = { ...layouts[idx], ...rest };
  await writeLayouts(layouts);
  return NextResponse.json({ success: true, layout: layouts[idx] });
}

export async function DELETE(req: Request) {
  const { id } = await req.json();
  const layouts = await readLayouts();
  const idx = layouts.findIndex((l: any) => l.id === id);
  if (idx === -1)
    return NextResponse.json(
      { success: false, error: "Not found" },
      { status: 404 }
    );
  layouts.splice(idx, 1);
  await writeLayouts(layouts);
  return NextResponse.json({ success: true });
}
