import { NextRequest, NextResponse } from "next/server";
import { createPackage, listPackages } from "@/lib/packages";
import { PackageInput } from "@/app/types/package";

export async function GET() {
    const packages = await listPackages();
    return NextResponse.json(packages);
}

export async function POST(req: NextRequest) {
    let body: Partial<PackageInput>;
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }
    try {
        const created = await createPackage(body as PackageInput);
        return NextResponse.json(created, { status: 201 });
    } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to create";
        return NextResponse.json({ error: message }, { status: 400 });
    }
}
