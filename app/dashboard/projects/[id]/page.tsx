// app/dashboard/projects/[id]/page.tsx
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import Link from 'next/link';
import { Paginator } from '@/components/paginator';
import { getEvents } from '@/lib/data/events';

export default async function ProjectDetailPage({
    params,
    searchParams
}: {
    params: Promise<{ id: string }>;
    searchParams?: Promise<{ page?: string }>;
}) {
    const { id } = await params;
    const { page = '1' } =  await searchParams || {};
    const pageNumber = parseInt(page, 10);
    const baseUrl = `/dashboard/projects/${id}`;    
    
    const project = await prisma.project.findUnique({
        where: { id: id },
    });

    if (!project) {
        notFound();
    }

    const {events, totalPages}  = await getEvents({
        projectId: id,
        sortBy: 'createdAt',
        order: 'desc',
        query: '',
        page: pageNumber,
    });

    return (
        <div className="p-6 space-y-4">
            <Link href="/dashboard/projects" className="text-blue-600 hover:underline">
                ← Back to Projects
            </Link>

            <h1 className="text-2xl font-bold">{project.name}</h1>
            <p className="text-gray-700">{project.description}</p>

            <h2 className="text-xl font-semibold mt-6">Events</h2>
            <table className="w-full border table-auto">
                <thead className="bg-gray-100">
                <tr>
                    <th className="p-2 text-left">Type</th>
                    <th className="p-2 text-left">Payload</th>
                    <th className="p-2 text-left">Created At</th>
                </tr>
                </thead>
                <tbody>
                {events.map((event) => (
                    <tr key={event.id} className="border-t">
                    <td className="p-2">{event.type}</td>
                    <td className="p-2">
                        <pre className="text-xs overflow-auto max-w-[500px]">
                        {JSON.stringify(event.payload, null, 2)}
                        </pre>
                    </td>
                    <td className="p-2">
                        {format(new Date(event.createdAt), 'yyyy-MM-dd HH:mm:ss')}
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {/* Pagination */}
            <div className="flex gap-2 mt-4">
                <Paginator
                    page={pageNumber}
                    totalPages={totalPages}
                    baseUrl={baseUrl}
                />
            </div>
        </div>
    );
}