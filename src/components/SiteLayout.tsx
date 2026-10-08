import { useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import {
  Sprout,
  Menu,
  X,
  Home,
  Megaphone,
  Search,
  Star,
  MessageCircle,
  LogIn,
  Mail,
  ArrowRight,
} from "lucide-react";

const navItems = [
  { to: "/", label: "Home", icon: Home },
  { to: "/pubblica-annuncio", label: "Pubblica annuncio", icon: Megaphone },
  { to: "/trova-lavoro", label: "Trova lavoro", icon: Search },
  { to: "/#annunci", label: "Annunci in primo piano", icon: Star, hash: "annunci" },
  { to: "/#dicono-di-noi", label: "Dicono di noi", icon: MessageCircle, hash: "dicono-di-noi" },
  { to: "/#contatti", label: "Contatti", icon: Mail, hash: "contatti" },
] as const;

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-1.5">
      <Sprout className="h-7 w-7 text-foreground" strokeWidth={2.2} />
      <span className="font-display text-3xl font-semibold tracking-tight text-primary">
        semi
      </span>
    </Link>
  );
}

export function SiteLayout({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <button
            type="button"
            aria-label="Apri il menu"
            onClick={() => setMenuOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-secondary"
          >
            <Menu className="h-5 w-5" />
          </button>
          <Logo />
          <button
            type="button"
            onClick={() => setLoginOpen(true)}
            className="rounded-full border border-border px-5 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
          >
            Accedi
          </button>
        </div>
      </header>

      {/* Sidebar menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-foreground/40"
            onClick={() => setMenuOpen(false)}
          />
          <aside className="absolute left-0 top-0 flex h-full w-72 flex-col bg-card shadow-2xl">
            <div className="flex items-center justify-between border-b border-border px-6 py-5">
              <Logo />
              <button
                type="button"
                aria-label="Chiudi il menu"
                onClick={() => setMenuOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border transition-colors hover:bg-secondary"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <nav className="flex flex-col gap-1 p-4">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.to}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
                >
                  <item.icon className="h-4 w-4 text-primary" />
                  {item.label}
                </a>
              ))}
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  setLoginOpen(true);
                }}
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
              >
                <LogIn className="h-4 w-4 text-primary" />
                Accedi
              </button>
            </nav>
          </aside>
        </div>
      )}

      {/* Login modal */}
      {loginOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div
            className="absolute inset-0 bg-foreground/40"
            onClick={() => setLoginOpen(false)}
          />
          <div className="relative w-full max-w-md rounded-3xl border border-border bg-card p-8 shadow-2xl">
            <button
              type="button"
              aria-label="Chiudi"
              onClick={() => setLoginOpen(false)}
              className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full border border-border transition-colors hover:bg-secondary"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-2">
              <LogIn className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-bold">Accedi</h2>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Entra con la tua email e password
            </p>
            <form
              className="mt-6 space-y-4"
              onSubmit={(e) => e.preventDefault()}
            >
              <div>
                <label htmlFor="login-email" className="text-sm font-semibold">
                  Email
                </label>
                <input
                  id="login-email"
                  type="email"
                  placeholder="tu@email.it"
                  className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                />
              </div>
              <div>
                <label htmlFor="login-password" className="text-sm font-semibold">
                  Password
                </label>
                <input
                  id="login-password"
                  type="password"
                  placeholder="••••••••"
                  className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                />
              </div>
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                Accedi
                <ArrowRight className="h-4 w-4" />
              </button>
              <p className="text-center text-sm text-muted-foreground">
                Non hai un account?{" "}
                <a href="#registrati" className="font-semibold text-primary underline">
                  Registrati
                </a>
              </p>
            </form>
          </div>
        </div>
      )}

      <main>{children}</main>

      {/* Footer */}
      <footer className="border-t border-border py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 text-sm text-muted-foreground md:flex-row">
          <Logo />
          <p>© 2026 semi — Il lavoro educativo cresce qui</p>
        </div>
      </footer>
    </div>
  );
}
