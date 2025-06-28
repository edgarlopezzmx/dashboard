import { z } from 'zod';

export const projectQuerySchema = z.object({
    projectId: z.string().uuid().optional(),
    query: z.string().optional(),
    sortBy: z.enum(['name', 'createdAt'])
        .default('createdAt')
        .optional(),
    order: z.enum(['asc', 'desc'])
        .default('desc')
        .optional(),
    page: z
        .string()
        .optional()
        .transform((val) => (val ? parseInt(val, 10) : 1))
        .refine((val) => !isNaN(val) && val > 0, {
            message: 'Page must be a positive integer',
        }),
});