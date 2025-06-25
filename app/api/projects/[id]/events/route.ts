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
    
    let raw: unknown;
    try {
        raw = await req.json();
    } catch (error) {
        console.error('Webhook error:', error);
        return NextResponse.json(
            { error: "Invalid JSON" },
            { status: 400 }
        );
    }

    const body = raw as { type: string; payload: unknown };

    if (!body.type || !body.payload) {
        return NextResponse.json(
            { error: "Type and payload are required" },
            { status: 400 }
        );
    }

    try {
        const event = await prisma.event.create({
            data: {
                projectId,
                type: body.type,
                payload: body.payload,
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