import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { GraduationCap, Mail, Lock, User, Eye, EyeOff, Check } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/signup")({
  head: () => ({ meta: [{ title: "Create account — EduFind" }] }),
  component: SignupPage,
});

function strength(p: string) {
  let s = 0;
  if (p.length >= 8) s++;
  if (/[A-Z]/.test(p)) s++;
  if (/[0-9]/.test(p)) s++;
  if (/[^A-Za-z0-9]/.test(p)) s++;
  return s;
}

import { authApi } from "@/lib/api";
import { useNavigate } from "@tanstack/react-router";

function SignupForm() {
  const [show, setShow] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const s = strength(pw);
  const labels = ["Too weak", "Weak", "Okay", "Good", "Strong"];
  const colors = ["bg-destructive", "bg-destructive", "bg-warning", "bg-primary", "bg-success"];
  const match = pw && confirm && pw === confirm;
  const mismatch = pw && confirm && pw !== confirm;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mismatch) return toast.error("Passwords do not match");
    setLoading(true);
    try {
      const res = await authApi.signup({ name, email, password: pw });
      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));
      toast.success("Account created successfully!");
      navigate({ to: "/colleges" });
    } catch (err: any) {
      toast.error(err.message || "Could not create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-4">
      <div>
        <label className="text-xs font-medium">Full name</label>
        <div className="relative mt-1.5">
          <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Aarav Sharma"
            className="h-11 w-full rounded-xl border border-input bg-background pl-9 pr-3 text-sm outline-none focus:border-ring"
          />
        </div>
      </div>
      <div>
        <label className="text-xs font-medium">Email</label>
        <div className="relative mt-1.5">
          <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
            className="h-11 w-full rounded-xl border border-input bg-background pl-9 pr-3 text-sm outline-none focus:border-ring"
          />
        </div>
      </div>
      <div>
        <label className="text-xs font-medium">Password</label>
        <div className="relative mt-1.5">
          <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type={show ? "text" : "password"}
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            required
            placeholder="Enter you password"
            className="h-11 w-full rounded-xl border border-input bg-background pl-9 pr-10 text-sm outline-none focus:border-ring"
          />
          <button
            type="button"
            onClick={() => setShow(!show)}
            className="absolute right-2 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-md hover:bg-secondary"
          >
            {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {pw && (
          <div className="mt-2">
            <div className="flex gap-1">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className={`h-1 flex-1 rounded-full ${i < s ? colors[s] : "bg-secondary"}`} />
              ))}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{labels[s]}</p>
          </div>
        )}
      </div>
      <div>
        <label className="text-xs font-medium">Confirm password</label>
        <div className="relative mt-1.5">
          <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            placeholder="Confirm your password"
            className={`h-11 w-full rounded-xl border bg-background pl-9 pr-3 text-sm outline-none focus:border-ring ${mismatch ? "border-destructive" : match ? "border-success" : "border-input"}`}
          />
        </div>
        {mismatch && <p className="mt-1 text-xs text-destructive">Passwords do not match</p>}
        {match && (
          <p className="mt-1 flex items-center gap-1 text-xs text-success">
            <Check className="h-3 w-3" /> Passwords match
          </p>
        )}
      </div>

      <button
        disabled={loading}
        className="h-11 w-full rounded-xl bg-primary text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-50"
      >
        {loading ? "Creating account..." : "Create account"}
      </button>
    </form>
  );
}

function SignupPage() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div
        className="relative hidden overflow-hidden lg:flex lg:flex-col lg:justify-between lg:p-12"
        style={{ background: "var(--gradient-primary)" }}
      >
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-card/10 blur-3xl" />
        <Link to="/colleges" className="relative flex items-center gap-2 text-primary-foreground">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-card/20 backdrop-blur">
            <GraduationCap className="h-5 w-5" />
          </div>
          <span className="text-lg font-semibold">EduFind</span>
        </Link>
        <div className="relative max-w-md text-primary-foreground">
          <h2 className="text-3xl font-bold leading-tight">Create your free account</h2>
          <p className="mt-3 text-sm text-primary-foreground/80">Save colleges and compare them.</p>
          <ul className="mt-6 space-y-2 text-sm text-primary-foreground/90">
            {["Save unlimited colleges", "Compare up to 3 side-by-side"].map((t) => (
              <li key={t} className="flex items-center gap-2">
                <Check className="h-4 w-4" /> {t}
              </li>
            ))}
          </ul>
        </div>
        <p className="relative text-xs text-primary-foreground/70"></p>
      </div>

      <div className="flex items-center justify-center bg-background p-6 md:p-10">
        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-bold tracking-tight">Get started</h1>
          <p className="mt-1 text-sm text-muted-foreground">Create your EduFind account in seconds.</p>

          <SignupForm />

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}


          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-primary hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
