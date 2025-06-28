// lib/validations/zodErrors.ts

import { ZodError } from "zod";

export function extractZodErrors(error: ZodError): Record<string, string> {
    const errors: Record<string, string> = {};
    for (const issue of error.issues) {
        const field = issue.path[0];
        if (typeof field === 'string') {
            errors[field] = issue.message;
        }
    }
    return errors;
}

