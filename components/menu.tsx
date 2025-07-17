import Link from "next/link";
type MenuItem = {
    label: string;
    href: string;
    icon?: React.ReactNode;
};

interface MenuProps {
    items: MenuItem[];
    actions?: React.ReactNode;
}

export default function Menu({ items, actions }: MenuProps) {
    return (
        <nav className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
            <div className="text-xl font-bold text-blue-600">
                <Link href="/">Home</Link>
            </div>
            <input id="menu-toggle" type="checkbox" className="hidden peer" />
            <label htmlFor="menu-toggle" className="md:hidden cursor-pointer">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </label>
            <ul className="flex-col md:flex-row md:flex gap-6 md:static absolute top-16 left-0 w-full bg-white md:w-auto md:bg-transparent hidden peer-checked:flex z-10">
                {items.map((item) => (
                    <li key={item.label}>
                        <Link href={item.href} className="block py-2 px-4 hover:text-blue-600">
                            {item.icon}
                            {item.label}
                        </Link>
                    </li>
                ))}
            </ul>
            {actions && <div className="ml-auto">{actions}</div>}
        </nav>
    );
}
