// lib/types.ts

export type FormState = {
    status: 'idle' | 'success' | 'error',
    message: string,
    errors: Record<string, string>,
}
