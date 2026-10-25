import { useState, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Menu,
  X,
  Home,
  Megaphone,
  Search,
  Star,
  MessageCircle,
  Users,
  LogIn,
  LogOut,
  Mail,
  HeartHandshake,
  ChevronDown,
} from "lucide-react";
import { useAccount } from "@/hooks/use-account";
import logoImage from "@/assets/logo-semi-refined.png";

const navItems = [
  { to: "/", label: "Home", icon: Home },
  { to: "/pubblica-annuncio", label: "Pubblica annuncio", icon: Megaphone },
  { to: "/trova-lavoro", label: "Trova lavoro", icon: Search },
  { to: "/#annunci", label: "Annunci in primo piano", icon: Star, hash: "annunci" },
  { to: "/volontariato", label: "Opportunità di volontariato", icon: HeartHandshake },
  { to: "/#dicono-di-noi", label: "Dicono di noi", icon: MessageCircle, hash: "dicono-di-noi" },
  { to: "/chi-siamo", label: "Chi siamo", icon: Users },
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
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const { user, tipo } = useAccount();
  const { data: profilo } = useQuery({
    queryKey: ["profilo", user?.id],
    enabled: !!user,
    queryFn: async () => (await supabase.from("profiles").select("nome, foto_path").eq("id", user!.id).maybeSingle()).data,
  });
  const iniziale = (profilo?.nome?.trim() || String(user?.user_metadata?.nome || "").trim() || user?.email?.split("@")[0] || "U").charAt(0).toUpperCase();
  const fotoUrl = profilo?.foto_path ? supabase.storage.from("foto-profilo").getPublicUrl(profilo.foto_path).data.publicUrl : null;
  const accountTo = user ? "/area-personale" : "/auth";
  const accountLabel = user ? "Area personale" : "Accedi";
  async function esci() {
    const { error } = await supabase.auth.signOut();
    if (error) return;
    setAccountMenuOpen(false);
    navigate({ to: "/auth", replace: true });
  }

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
          <div className="relative ml-auto justify-self-end">
            {user ? (
              <>
                <div className="flex items-center rounded-full border border-border text-xs font-semibold text-foreground sm:text-sm">
                  <Link to="/area-personale" hash="dashboard" onClick={() => setAccountMenuOpen(false)} aria-label="Apri la dashboard dell’area personale" title="Area personale" className="flex items-center justify-center rounded-l-full px-2 py-1 transition-colors hover:bg-secondary sm:pl-3 sm:pr-2"><span className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-primary/15 text-sm font-bold text-primary">{fotoUrl ? <img src={fotoUrl} alt="Foto profilo" className="h-full w-full object-cover" /> : iniziale}</span></Link>
                  <button type="button" aria-label="Apri le sezioni dell'area personale" aria-expanded={accountMenuOpen} aria-controls="menu-area-personale" onClick={() => setAccountMenuOpen(v => !v)} className="rounded-r-full border-l border-border px-2 py-2 transition-colors hover:bg-secondary sm:pr-3">
                    <ChevronDown className={`h-4 w-4 transition-transform ${accountMenuOpen ? "rotate-180" : ""}`} />
                  </button>
                </div>
                {accountMenuOpen && (
                  <>
                    <button type="button" aria-label="Chiudi menu area personale" className="fixed inset-0 z-40 cursor-default" onClick={() => setAccountMenuOpen(false)} />
                    <nav id="menu-area-personale" aria-label="Sezioni area personale" className="absolute right-0 top-full z-50 mt-2 w-60 rounded-2xl border border-border bg-card p-2 shadow-xl">
                      {(tipo === "servizio"
                        ? [["I miei annunci", "miei-annunci"], ["Il mio profilo", "profilo"], ["Password e sicurezza", "password-sicurezza"], ["Gestione account", "gestione-account"]]
                        : [["Colloqui fissati", "colloqui-fissati"], ["Le mie candidature", "mie-candidature"], ["Il mio profilo", "profilo"], ["Password e sicurezza", "password-sicurezza"], ["Gestione account", "gestione-account"]]
                      ).map(([label, id]) => (
                        <a key={id} href={`/area-personale#${id}`} onClick={() => setAccountMenuOpen(false)} className="block rounded-xl px-4 py-3 text-sm font-semibold hover:bg-secondary">{label}</a>
                      ))}
                      <button type="button" onClick={esci} className="mt-1 flex w-full items-center gap-2 rounded-xl border-t border-border px-4 py-3 text-left text-sm font-semibold hover:bg-secondary"><LogOut className="h-4 w-4 text-primary" />Esci</button>
                    </nav>
                  </>
                )}
              </>
            ) : (
              <Link to={accountTo} className="rounded-full border border-border px-3 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-secondary sm:px-5 sm:text-sm">{accountLabel}</Link>
            )}
          </div>
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
