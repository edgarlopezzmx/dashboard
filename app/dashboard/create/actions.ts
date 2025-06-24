'use server';

import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export async function createProject(formData: FormData) {
    const name = formData.get('name')?.toString().trim();
    const description = formData.get('description')?.toString().trim();

    if (!name || !description) {
        throw new Error('Name and description are required');
    }

    const project = await prisma.project.create({
        data: {
            name,
            description,
        },
    });

    revalidatePath('/dashboard/projects');
    
    redirect(`/dashboard/projects/${project.id}`);
}