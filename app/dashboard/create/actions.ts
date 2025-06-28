'use server';

import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const projectSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    description: z.string().min(1, 'Description is required'),
})

export async function createProject(initialState: any, formData: FormData) {
    const validatedFields = projectSchema.safeParse({
        name: formData.get('name'),
        description: formData.get('description'),
    });

    if (!validatedFields.success) {

        return {
            status: 'error',
            errors: validatedFields.error.flatten().fieldErrors,
        }
    }

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