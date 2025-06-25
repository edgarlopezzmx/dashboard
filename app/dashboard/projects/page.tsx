import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { format } from 'date-fns';
import SortableHeader from './sortable-header';
import { deleteProject } from './actions';


export default async function ProjectListPage(props: any) {
    const { searchParams } = props;
    
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
                                column="name"
                                currentSort={sortBy}
                                currentOrder={order}
                            />
                            <SortableHeader
                                column="createdAt"
                                currentSort={sortBy}
                                currentOrder={order}
                            />
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {projects.map((project) => (
                            <tr key={project.id} className='border-gray-200'>
                                <td className="border px-4 py-2">
                                    <Link href={`/dashboard/projects/${project.id}`}>
                                        {project.name}
                                    </Link>
                                </td>
                                <td className="border px-4 py-2">
                                    {format(new Date(project.createdAt), 'PPP')}
                                </td>
                                <td className="border px-4 py-2">
                                    <form action={deleteProject}>
                                        <input type="hidden" name="id" value={project.id}/>
                                        <button
                                            type="submit"
                                            className="text-red-500 hover:text-red-700 ml-4"
                                            title="Delete Project"
                                            
                                        >Delete</button>
                                    </form>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}