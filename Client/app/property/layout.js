"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  { href: "/property/general", label: "General Information" },
  { href: "/property/flyer", label: "Flyer Builder" },
  { href: "/property/captions", label: "Social Captions" },
];

function NavLinks({ variant = "sidebar" }) {
  const pathname = usePathname();

  return (
    <nav className={variant === "tabs" ? "flex gap-2" : "flex flex-col gap-1"}>
      {nav.map((item) => {
        const active =
          pathname === item.href || pathname?.startsWith(item.href + "/");

        return (
          <Link
            key={item.href}
            href={item.href}
            className={[
              "rounded-md px-3 py-2 text-sm transition",
              active
                ? "bg-blue-50 text-blue-700 ring-1 ring-blue-100"
                : "text-gray-700 hover:bg-gray-100",
            ].join(" ")}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export default function PropertyLayout({ children }) {
  return (
    <div className="min-h-[calc(100vh-73px)] bg-gray-50">
      <div className="mx-auto w-full max-w-[1440px] p-8">
        {/* Mobile step nav */}
        <div className="lg:hidden">
          <div className="mb-8 rounded-xl bg-white p-4 ring-1 ring-gray-200">
            <div className="mb-2 text-xs font-semibold tracking-wide text-gray-500">
              Property Workflow
            </div>
            <NavLinks variant="tabs" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[240px_1fr] lg:gap-8">
          {/* Desktop sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-6 rounded-xl bg-white p-3 ring-1 ring-gray-200">
              <div className="px-2 py-2 text-xs font-semibold tracking-wide text-gray-500">
                Property Workflow
              </div>
              <NavLinks variant="sidebar" />
            </div>
          </aside>

          {/* Main */}
          <main className="min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}
