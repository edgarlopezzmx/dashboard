import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { eventSchema } from "@/lib/validations/eventSchema";

export async function POST(
    request: Request,
    { params } : { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    if (!id) {
        return NextResponse.json(
            { error: "Project ID is required" },
            { status: 400 }
        );
    }

    const project = await prisma.project.findUnique({
        where: { id },
    });

    if (!project) {
        return NextResponse.json(
            { error: "Project not found" },
            { status: 404 }
        );
    }
    
    let raw: unknown;
    try {
        raw = await request.json();
        console.log('Webhook received:', raw);
    } catch (error) {
        console.error('Webhook error:', error);
        return NextResponse.json(
            { error: "Invalid JSON" },
            { status: 400 }
        );
    }

    const parsed = eventSchema.safeParse(raw);
    
    if (!parsed.success) {
        console.error("Validation error:", parsed.error);
        return NextResponse.json(
            { error: "Invalid event data" , details: parsed.error.flatten() },
            { status: 400 }
        );
    }

    const { type, payload } = parsed.data;

    try {
        const event = await prisma.event.create({
            data: {
                projectId: id,
                type: type,
                payload: payload as Prisma.InputJsonValue,
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