import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
    for (let i = 1; i <= 3; i++) {
        const project = await prisma.project.create({
            data: {
                name: `Project ${i}`,
                description: `Description for Project ${i}`,
                createdAt: new Date(),
            },
        });
        for (let j = 1; j <= 20; j++) {
            await prisma.event.create({
                data: {
                    projectId: project.id,
                    type: `user.singup`,
                    payload: {
                        userId: `user${j}`,
                        plan: j % 2 === 0 ? "pro" : "free",
                    }
                }
            });
        }
    }
}

main()
    .then(() => prisma.$disconnect())
    .catch((e) => {
        console.error(e);
        prisma.$disconnect();
    });