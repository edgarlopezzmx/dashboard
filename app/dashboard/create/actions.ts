// dashboard/app/dashboard/create/actions.ts
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
    const raw = {
        name: formData.get('name'),
        description: formData.get('description'),
    }

    const validatedFields = projectSchema.safeParse(raw);

    if (!validatedFields.success) {
        const errors = extractZodErrors(validatedFields.error);

        return {
            status: 'error',
            message: 'Validation failed',
            errors,
        }
    }

    const { name, description } = validatedFields.data;

    const project = await prisma.project.create({ data: { name, description } });

    revalidatePath('/dashboard/projects');
    redirect(`/dashboard/projects/${project.id}`);

    return {
        status: 'success',
        message: 'Project created successfully',
        errors: {},
    };
}