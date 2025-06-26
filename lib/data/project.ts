import { prisma } from "@/lib/prisma";

export async function getProjects({
    sortBy  = "createdAt",
    order = "desc",
    query = "",
    page = 1,
}: {
    sortBy?: string;
    order?: string;
    query?: string;
    page?: number;
}) {
    const pageSize = 20; // Adjust as needed
    const projects = await prisma.project.findMany({
        where: {
            name: {
                contains: query,
            },
        },
        orderBy: {
            [sortBy]: order,
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
    });

    return projects;
}