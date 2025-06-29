// lib/validations/eventSchema.ts

import { z } from "zod";

export const eventSchema = z.object({
    type: z.string().min(1, "Type is required"),
    payload: z.record(z.unknown()),
    projectId: z.string().uuid("Invalid project ID format").optional(),
    createdAt: z.date().optional(),
});

export type EventSchema = z.infer<typeof eventSchema>;