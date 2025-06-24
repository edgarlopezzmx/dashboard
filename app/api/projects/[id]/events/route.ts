import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function POST(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const projectId = params.id;

    if (!projectId) {
        return NextResponse.json(
            { error: "Project ID is required" },
            { status: 400 }
        );
    }

    let body: { type: string; payload: any };
    
    try {
        body = await req.json();
    } catch (error) {
        return NextResponse.json(
            { error: "Invalid JSON" },
            { status: 400 }
        );
    }

    const { type, payload } = body;

    if (!type || !payload) {
        return NextResponse.json(
            { error: "Type and payload are required" },
            { status: 400 }
        );
    }

    try {
        const event = await prisma.event.create({
            data: {
                projectId,
                type,
                payload,
                // payload: JSON.stringify(payload),
            },
        });

        revalidatePath(`/dashboard/projects/${projectId}`);

        return NextResponse.json(event, { status: 201 });
    } catch (error) {
        console.error("Error creating event:", error);
        return NextResponse.json(
            { error: "Failed to create event" },
            { status: 500 }
        );
    }
}