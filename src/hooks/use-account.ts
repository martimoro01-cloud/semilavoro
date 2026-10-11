import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type TipoAccount = "educatore" | "servizio";

/** Session-driven account info for UI affordances (not a route guard). */
export function useAccount() {
  const [user, setUser] = useState<User | null>(null);
  const [tipo, setTipo] = useState<TipoAccount | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function load(u: User | null) {
      if (!active) return;
      setUser(u);
      if (!u) {
        setTipo(null);
        setLoading(false);
        return;
      }
      const { data } = await supabase.from("user_roles").select("role").eq("user_id", u.id);
      if (!active) return;
      const roles = (data ?? []).map((r) => r.role);
      setTipo(roles.includes("servizio") ? "servizio" : roles.includes("educatore") ? "educatore" : null);
      setLoading(false);
    }
    supabase.auth.getUser().then(({ data }) => load(data.user));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setTimeout(() => load(session?.user ?? null), 0);
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return { user, tipo, loading };
}
