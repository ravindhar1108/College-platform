import { GraduationCap, Github, Twitter, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-secondary/40">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-4 md:px-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <GraduationCap className="h-5 w-5" />
            </div>
            <span className="text-lg font-semibold">EduFind</span>
          </div>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            Discover, compare and choose the right college for your future — all in one place.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold">Product</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>
              <a href="/colleges" className="hover:text-foreground">Colleges</a>
            </li>
            <li>
              <a href="/compare" className="hover:text-foreground">Compare</a>
            </li>
            <li>
              <a href="/saved" className="hover:text-foreground">Saved</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-5 text-xs text-muted-foreground md:flex-row md:px-6">
        </div>
      </div>
    </footer>
  );
}
