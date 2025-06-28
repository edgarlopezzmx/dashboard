'use server';

import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { FormState } from '@/lib/types';
import { extractZodErrors } from '@/lib/validations/zodErrors';

const projectSchema = z.object({
    name: z.string().trim().min(1, 'Name is required'),
    description: z.string().trim().min(1, 'Description is required'),
})

export async function createProject(initialState: FormState, formData: FormData) {
    const validatedFields = projectSchema.safeParse(formData);

    if (!validatedFields.success) {
        const errors = extractZodErrors(validatedFields.error);

        return {
            status: 'error',
            message: 'Validation failed',
            errors,
        }
    }

    const { name, description } = validatedFields.data;

    if (!name || !description) {
        throw new Error('Name and description are required');
    }

    const project = await prisma.project.create({ data: { name, description } });

    revalidatePath('/dashboard/projects');
    console.log('Project created successfully:', project);
    redirect(`/dashboard/projects/${project.id}`);
}