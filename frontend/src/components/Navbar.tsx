import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { GraduationCap, Search, Heart, GitCompare, LogIn, Menu, X } from "lucide-react";
import { useState } from "react";
import { useAppStore } from "@/lib/store";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const saved = useAppStore((s) => s.saved.length);
  const compare = useAppStore((s) => s.compare.length);

  const links = [
    { to: "/colleges", label: "Colleges" },
    { to: "/compare", label: "Compare", badge: compare },
    { to: "/saved", label: "Saved", badge: saved },
  ];

  const [user, setUser] = useState(() => {
    if (typeof window === "undefined") return null;
    const u = localStorage.getItem("user");
    if (!u || u === "undefined") return null;
    try {
      return JSON.parse(u);
    } catch (e) {
      console.error("Failed to parse user from localStorage", e);
      return null;
    }
  });

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate({ to: "/login" });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 md:px-6">
        <Link to="/colleges" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <GraduationCap className="h-5 w-5" />
          </div>
          <span className="text-lg font-semibold tracking-tight">EduFind</span>
        </Link>

        <nav className="ml-6 hidden items-center gap-1 md:flex">
          {links.map((l) => {
            const active = path === l.to || (l.to === "/colleges" && path.startsWith("/colleges"));
            return (
              <Link
                key={l.to}
                to={l.to}
                className={`relative rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  active ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {l.label}
                {l.badge ? (
                  <span className="ml-1.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-semibold text-primary-foreground">
                    {l.badge}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto hidden items-center gap-2 md:flex">
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-foreground">{user.name.split(" ")[0]}</span>
              <button
                onClick={handleLogout}
                className="rounded-xl border border-input px-3 py-2 text-sm font-medium hover:bg-secondary"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm transition hover:opacity-90"
            >
              <LogIn className="h-4 w-4" /> Login
            </Link>
          )}
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="ml-auto inline-flex h-10 w-10 items-center justify-center rounded-xl border border-input md:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1 p-4">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-secondary"
              >
                <span>{l.label}</span>
                {l.badge ? (
                  <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] text-primary-foreground">
                    {l.badge}
                  </span>
                ) : null}
              </Link>
            ))}
            <Link
              to="/login"
              onClick={() => setOpen(false)}
              className="mt-2 inline-flex h-10 items-center justify-center gap-1.5 rounded-xl bg-primary text-sm font-medium text-primary-foreground"
            >
              <LogIn className="h-4 w-4" /> Login
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
