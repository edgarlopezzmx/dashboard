import Link from 'next/link';
import { format } from 'date-fns';
import SortableHeader from './sortable-header';
import { deleteProject } from './actions';
import { getProjects } from '@/lib/data/project';

export default async function ProjectListPage({
    searchParams
}:{
    searchParams: Promise< {sortBy?: string; order?: string; query?: string; page?: string} >;
}) {
    const {sortBy = "createdAt" } = await searchParams;
    const {order = "desc" } = await searchParams;
    const {query = "" } = await searchParams;
    const {page = "1"} = await searchParams;
    const pageNumber = parseInt(page, 10);

    const {projects, totalProjects, totalPages} = await getProjects({
        sortBy,
        order,
        query,
        page: pageNumber,
    });

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Projects</h1>
            <div className="mb-4">
                <Link href="/dashboard/create" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                    Create New Project
                </Link>
            </div>
            <div className='mb-4'>
                <form method='GET'>
                    <input
                        type="text"
                        name="query"
                        placeholder="Search projects..."
                        className="border border-gray-300 rounded px-4 py-2 w-full"
                        defaultValue={query}
                    />
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-2"
                        type="submit"
                    >Search
                    </button>
                </form>
            </div>
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
                    <tbody className='mb-4'>
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
                    <tfoot className='mb-4'>
                        <tr className='mb-4'>
                            <td colSpan={3} className="text-center">
                            {pageNumber > 1 && (
                                <Link
                                    href={`/dashboard/projects?page=${pageNumber - 1}&sortBy=${sortBy}&order=${order}&query=${query}`}
                                    className="px-3 py-1 my-2 border rounded text-blue-500 hover:bg-gray-100"
                                >
                                    Previous
                                </Link>
                            )}
                            <Link 
                                href={`/dashboard/projects?page=${pageNumber + 1}&sortBy=${sortBy}&order=${order}&query=${query}`}
                                className="px-3 py-1 my-2 border rounded text-blue-500 hover:bg-gray-100 ml-2"
                            >
                                Next
                            </Link>
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    );
}