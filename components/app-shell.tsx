"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PropsWithChildren } from "react";

const navItems = [
  { href: "/", label: "Dashboard" },
  { href: "/create-post", label: "Create Post" },
  { href: "/calendar", label: "Calendar" },
  { href: "/drafts", label: "Drafts / Approval Queue" },
  { href: "/analytics", label: "Analytics" },
  { href: "/accounts", label: "Connected Accounts" },
  { href: "/settings", label: "Settings" },
];

export function AppShell({ children }: PropsWithChildren) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 md:flex-row md:items-center md:justify-between md:px-6">
          <div>
            <h1 className="text-xl font-semibold">AI Social Media Agent</h1>
            <p className="text-sm text-slate-600">MVP dashboard (demo data + mock APIs)</p>
          </div>
          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800">Demo mode: publishing integrations are placeholders</span>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-4 px-4 py-4 md:grid-cols-[250px_1fr] md:px-6 md:py-6">
        <nav aria-label="Primary" className="h-fit rounded-xl border border-slate-200 bg-white p-2">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`block rounded-md px-3 py-2 text-sm transition ${
                      active ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <main>{children}</main>
      </div>
    </div>
  );
}
