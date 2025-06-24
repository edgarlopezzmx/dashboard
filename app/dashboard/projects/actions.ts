'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function deleteProject(formData: FormData) {
    const projectId = formData.get('id') as string;
    if (!projectId) throw new Error('Project ID is required.');

    try {
        await prisma.project.delete({
            where: { id: projectId },
        });
        revalidatePath('/dashboard/projects');
    } catch (error) {
        console.error('Error deleting project:', error);
        throw error;
        // throw new Error('Failed to delete project');
    }
}