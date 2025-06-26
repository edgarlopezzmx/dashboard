import Link from "next/link";

type PaginatorProps = {
    page: number;
    totalPages: number;
    baseUrl: string;
    query?: string;
    sortBy?: string;
    order?: string;
};

export function Paginator({
    page,
    totalPages,
    query = "",
    sortBy = "",
    order = "",
    baseUrl = "",
}: PaginatorProps) {
    const getPageNumbers = () => {
        const delta = 2;
        const range = [];
        const start = Math.max(1, page - delta);
        const end = Math.min(totalPages, page + delta);
        for (let i = start; i <= end; i++) {
            range.push(i);
        }
        return range;
    }

    const pageNumbers = getPageNumbers();

    const queryString = (pageNum: number) => `${baseUrl}` +
        `?query=${encodeURIComponent(query)}&page=${pageNum}` +
        (sortBy ? `&sortBy=${encodeURIComponent(sortBy)}` : "") +
        (order ? `&order=${encodeURIComponent(order)}` : "")
        ;
    return (
        <div className="flex items-center justify-between mt-8">
            <span className="text-sm text-gray-600">
                Page {page} of {totalPages}
            </span>
            <div className="flex gap-1">
                <Link
                    href={queryString(page - 1)}
                    className={
                        `px-3 py-1 rounded ${
                            page <= 1
                            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                            : "bg-gray-100 hover:bg-gray-200"
                        }`
                    }
                >
                    Prev
                </Link>

                {pageNumbers.map((p) => (
                    <Link
                        key={p}
                        href={queryString(p)}
                        className={`px-3 py-1 rounded ${
                            p === page
                                ? "bg-blue-500 text-white border-blue-500"
                                : "bg-white hover:bg-gray-200 text-gray-700 border-gray-300"
                        }`}>
                        {p}
                    </Link>
                ))}

                <Link
                    href={queryString(page + 1)}
                    className={
                        `px-3 py-1 rounded ${
                            page >= totalPages
                            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                            : "bg-gray-100 hover:bg-gray-200"
                        }`
                    }
                >
                    Next
                </Link>
            </div>
        </div>
    );
}