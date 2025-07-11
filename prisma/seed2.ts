// prisma/seed2.ts
import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
    const alreadySeeded = await prisma.project.count();
    if (alreadySeeded >= 1000) {
        console.log('Database already seeded with projects. Exiting...');
        process.exit(0);
    }

    console.log('Seeding 1000 projects...');
    for (let i = 1; i <= 1000; i++) {
        const project = await prisma.project.create({
            data: {
                name: faker.company.name(),
                description: faker.company.catchPhrase(),
            },
        });

        console.log(`Created project ${project.id}`);

        const events = Array.from({ length: 20 }).map(() => ({
            projectId: project.id,
            type: faker.helpers.arrayElement([
                'user.signup',
                'order.created',
                'payment.completed',
                'payment.failed',
                'user.logout',
                'user.update_profile',
                'user.delete_account',
            ]),
            payload: {
                userId: faker.string.uuid(),
                plan: faker.helpers.arrayElement(['free', 'pro', 'enterprise']),
                amount: faker.number.int({ min: 1000, max: 10000 }),
                currency: faker.finance.currencyCode(),
            },
        }));

        await prisma.event.createMany({
            data: events,
        });
    }
    console.log('Seeding completed.');
}

main()
    .catch((e) => {
        console.error('Error during seeding:', e);
        process.exit(1);
    })
    .finally(() => {
        prisma.$disconnect();
    });