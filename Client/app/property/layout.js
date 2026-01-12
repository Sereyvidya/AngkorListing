import Link from "next/link";

const nav = [
  { href: "/property/general", label: "General Info" },
  { href: "/property/flyer", label: "Flyer Builder" },
  { href: "/property/captions", label: "Social Captions" },
];

export default function PropertyLayout({ children }) {
  return (
    <div className="min-h-[calc(100vh-73px)] bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-6">
          {/* Sidebar */}
          <aside className="w-64 shrink-0">
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-3">
              <div className="text-xs font-semibold text-gray-500 px-2 py-2">
                Property Workflow
              </div>

              <nav className="flex flex-col gap-1">
                {nav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main */}
          <main className="flex-1">{children}</main>
        </div>
      </div>
    </div>
  );
}
