// app/dashboard/projects/[id]/page.tsx
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import Link from 'next/link';

interface Props {
    params: {
        id: string
    };
    searchParams?: {
        page?: string
    }
}

export default async function ProjectDetailPage({ params, searchParams}: Props) {
    const projectId = params.id;
    const page = parseInt(searchParams?.page || '1', 10);
    const pageSize = 10;
    const skip = (page - 1) * pageSize;

    const project = await prisma.project.findUnique({
        where: { id: projectId },
    });

    if (!project) {
        notFound();
    }

    const [events, totalEvents] = await Promise.all([
        prisma.event.findMany({
            where: { projectId },
            orderBy: { createdAt: 'desc' },
            skip,
            take: pageSize,
        }),
        prisma.event.count({
            where: { projectId }
        }),
    ]);

    const totalPages = Math.ceil(totalEvents / pageSize);

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
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <Link
                key={n}
                href={`/dashboard/projects/${projectId}?page=${n}`}
                className={`px-3 py-1 border rounded ${
                n === page ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'
                }`}
            >
                {n}
            </Link>
            ))}
        </div>
        </div>
    );
}