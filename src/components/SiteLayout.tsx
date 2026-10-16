import { useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import {
  Menu,
  X,
  Home,
  Megaphone,
  Search,
  Star,
  MessageCircle,
  LogIn,
  Mail,
  CalendarClock,
} from "lucide-react";
import { useAccount } from "@/hooks/use-account";
import logoImage from "@/assets/logo-semi-refined.png";

const navItems = [
  { to: "/", label: "Home", icon: Home },
  { to: "/pubblica-annuncio", label: "Pubblica annuncio", icon: Megaphone },
  { to: "/trova-lavoro", label: "Trova lavoro", icon: Search },
  { to: "/#annunci", label: "Annunci in primo piano", icon: Star, hash: "annunci" },
  { to: "/concorsi-bandi", label: "Concorsi e bandi", icon: CalendarClock },
  { to: "/#dicono-di-noi", label: "Dicono di noi", icon: MessageCircle, hash: "dicono-di-noi" },
  { to: "/#contatti", label: "Contatti", icon: Mail, hash: "contatti" },
] as const;

function Logo() {
  return (
    <Link to="/" aria-label="semi — Home" className="flex items-center justify-center">
      <img src={logoImage} alt="semi — Il lavoro educativo cresce qui" className="block h-auto w-36 object-contain object-center sm:w-44" width={710} height={255} />
    </Link>
  );
}

export function SiteLayout({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user } = useAccount();
  const accountTo = user ? "/area-personale" : "/auth";
  const accountLabel = user ? "Area personale" : "Accedi";

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
        <div className="relative mx-auto grid max-w-6xl grid-cols-[1fr_auto_1fr] items-center px-6 py-4">
          <button
            type="button"
            aria-label="Apri il menu"
            onClick={() => setMenuOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-secondary"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center justify-center"><Logo /></div>
          <Link
            to={accountTo}
            className="ml-auto max-w-[110px] justify-self-end rounded-full border border-border px-3 py-2 text-center text-xs font-semibold text-foreground transition-colors hover:bg-secondary sm:max-w-none sm:px-5 sm:text-sm"
          >
            {accountLabel}
          </Link>
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
              <Link
                to={accountTo}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
              >
                <LogIn className="h-4 w-4 text-primary" />
                {accountLabel}
              </Link>
            </nav>
          </aside>
        </div>
      )}

      <main>{children}</main>

      {/* Footer */}
      <footer className="border-t border-border py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-center px-6 text-center text-sm text-muted-foreground">
          <p>© 2026 semi — Il lavoro educativo cresce qui</p>
          <a href="/privacy" className="mt-3 underline">Privacy e dati personali</a>
        </div>
      </footer>
    </div>
  );
}
