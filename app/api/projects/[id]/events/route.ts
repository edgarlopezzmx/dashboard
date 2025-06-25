import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function POST(
    req: Request
) {
    const {id} = await req.json();

    if (!id) {
        return NextResponse.json(
            { error: "Project ID is required" },
            { status: 400 }
        );
    }
    
    let raw: unknown;
    try {
        raw = await req.json();
        console.log('Webhook received:', raw);
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
                projectId: id,
                type: body.type,
                payload: body.payload,
                // payload: JSON.stringify(payload),
            },
        });

        revalidatePath(`/dashboard/projects/${id}`);
        return NextResponse.json(event, { status: 201 });
    } catch (error) {
        console.error("Error creating event:", error);
        return NextResponse.json(
            { error: "Failed to create event" },
            { status: 500 }
        );
    }
}