'use client';

import { useActionState } from "react";
import { createProject } from "./actions";
import { FormState } from "@/lib/types";


const initialState : FormState = {
    status: 'idle',
    message: '',
    errors:{},
};

export default function CreateProjectPage() {
    const [state, formAction, pending] = useActionState<FormData, FormState>(createProject, initialState)

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Create Project</h1>
            <form action={formAction} 
                className="space-y-4"
                >
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Project Name</label>
                    <input
                        type="text"
                        name="name"
                        id="name"
                        required
                        className="w-full border rounded p-2"
                    />
                    {state?.errors?.name && (
                        <p className="text-red-500 text-sm mt-1">{state.errors.name}</p>
                    )}
                </div>
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                        name="description"
                        id="description"
                        required
                        rows={4}
                        className="w-full border rounded p-2"
                    ></textarea>
                    {state?.errors?.description && (
                        <p className="text-red-500 text-sm mt-1">{state.errors.description}</p>
                    )}
                </div>
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    disabled={pending}
                >
                    Create Project
                </button>
            </form>
        </div>
    );
}