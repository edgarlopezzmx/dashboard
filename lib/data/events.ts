import { prisma } from "@/lib/prisma";

export async function getEvents({
    projectId,
    sortBy  = "createdAt",
    order = "desc",
    query = "",
    page = 1,
}:{
    projectId: string;
    sortBy?: string;
    order?: string;
    query?: string;
    page?: number;
}) {
    const pageSize = 20; // Adjust as needed
    const events = await prisma.event.findMany({
        where: { 
            projectId: projectId,
            type: {
                contains: query,
                mode: 'insensitive', // Case-insensitive search
            },
        },
        orderBy: { 
            [sortBy]: order 
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
    });

    const totalEvents = await prisma.event.count({
        where: { projectId: projectId }
    });

    const totalPages = Math.ceil(totalEvents / pageSize);

    return {
        events,
        totalEvents,
        totalPages,
    };
}
