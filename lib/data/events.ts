import { prisma } from "@/lib/prisma";

export async function getEvents({
    projectId,
    sortBy  = "createdAt",
    order = "desc",
    query = "",
    page = 1,
}:{
    projectId: number;
    sortBy?: string;
    order?: string;
    query?: string;
    page?: number;
}) {
    const pageSize = 20; // Adjust as needed
    const idNumber = Number(projectId);
    const events = await prisma.event.findMany({
        where: { 
            projectId: idNumber,
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
        where: { projectId: idNumber }
    });

    const totalPages = Math.ceil(totalEvents / pageSize);

    return {
        events,
        totalEvents,
        totalPages,
    };
}
