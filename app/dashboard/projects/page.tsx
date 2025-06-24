import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { format } from 'date-fns';
import SortableHeader from './sortable-header';

interface Props {
    searchParams?: {
        sortBy?: string;
        order?: string;
    };
}

export default async function ProjectListPage({ searchParams }: Props) {
    const sortBy = searchParams?.sortBy ?? 'createdAt';
    const order = searchParams?.order ?? 'desc';

    const projects = await prisma.project.findMany({
        orderBy: {
            [sortBy]: order,
        },
    });

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Projects</h1>
            <div className='overflow-x-auto'>
                <table className="min-w-full bg-white">
                    <thead>
                        <tr>
                            <SortableHeader
                                title="Project Name"
                                column="name"
                                currentSort={sortBy}
                                currentOrder={order}
                            />
                            <SortableHeader
                                title="Created At"
                                column="createdAt"
                                currentSort={sortBy}
                                currentOrder={order}
                            />
                        </tr>
                    </thead>
                    <tbody>
                        {projects.map((project) => (
                            <tr key={project.id}>
                                <td className="border px-4 py-2">
                                    <Link href={`/dashboard/projects/${project.id}`}>
                                        {project.name}
                                    </Link>
                                </td>
                                <td className="border px-4 py-2">
                                    {format(new Date(project.createdAt), 'PPP')}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}