'use client';

import { useRouter, useSearchParams } from "next/navigation";

interface Props {
    column: 'name' | 'createdAt';
    currentSort: string;
    currentOrder: string;
}

export default function SortableHeader({ column, currentSort, currentOrder }: Props) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const isActive = currentSort === column;
    const nextOrder = isActive && currentOrder === 'asc' ? 'desc' : 'asc';
    const handleSortChange = () => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('sortBy', column);
        params.set('order', nextOrder);
        router.push(`?${params.toString()}`);
    };

    return (
        <th
            className={`cursor-pointer px-4 py-2 ${isActive ? 'bg-gray-200' : ''}`}
            onClick={handleSortChange}
        >
            {column.charAt(0).toUpperCase() + column.slice(1)}
            {isActive ? (nextOrder === 'asc' ? '↑' : '↓') : ''}
        </th>
    );
}