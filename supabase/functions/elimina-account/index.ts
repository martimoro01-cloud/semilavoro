// Deploy as Supabase Edge Function "elimina-account" with JWT verification enabled.
// Requires SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY as server-side secrets.
import { createClient } from "npm:@supabase/supabase-js@2";

Deno.serve(async req => {
  const origin = req.headers.get("origin") ?? "";
  const allowed = (Deno.env.get("ALLOWED_ORIGINS") ?? "").split(",").map(s => s.trim());
  const headers = { "Access-Control-Allow-Origin": allowed.includes(origin) ? origin : "", "Access-Control-Allow-Headers": "authorization, apikey, content-type", "Access-Control-Allow-Methods": "POST, OPTIONS", "Content-Type": "application/json" };
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers });
  if (req.method !== "POST" || !allowed.includes(origin)) return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403, headers });
  const jwt = req.headers.get("Authorization")?.replace(/^Bearer /i, "");
  if (!jwt) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers });
  const url = Deno.env.get("SUPABASE_URL")!;
  const service = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const admin = createClient(url, service, { auth: { persistSession: false } });
  const { data: { user }, error: authError } = await admin.auth.getUser(jwt);
  if (authError || !user) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers });
  try {
    // Delete candidate CVs owned by the account or linked to its postings.
    const { data: ads, error: adsError } = await admin.from("annunci").select("id").eq("owner_id", user.id);
    if (adsError) throw adsError;
    const adIds = (ads ?? []).map(a => a.id);
    const { data: ownApps, error: ownError } = await admin.from("candidature").select("cv_path").eq("candidato_id", user.id);
    if (ownError) throw ownError;
    const cvPaths = (ownApps ?? []).map(c => c.cv_path);
    if (adIds.length) {
      const { data: otherApps, error: otherError } = await admin.from("candidature").select("cv_path").in("annuncio_id", adIds);
      if (otherError) throw otherError;
      cvPaths.push(...(otherApps ?? []).map(c => c.cv_path));
    }
    for (let i = 0; i < cvPaths.length; i += 100) {
      const { error } = await admin.storage.from("cv").remove(cvPaths.slice(i, i + 100));
      if (error) throw error;
    }
    const { data: profile, error: profileError } = await admin.from("profiles").select("foto_path").eq("id", user.id).maybeSingle();
    if (profileError) throw profileError;
    if (profile?.foto_path) {
      const { error } = await admin.storage.from("foto-profilo").remove([profile.foto_path]);
      if (error) throw error;
    }
    // Remove own applications first, then ads; linked conversations cascade.
    const { error: delApplications } = await admin.from("candidature").delete().eq("candidato_id", user.id);
    if (delApplications) throw delApplications;
    const { error: delAds } = await admin.from("annunci").delete().eq("owner_id", user.id);
    if (delAds) throw delAds;
    const { error: deleteUser } = await admin.auth.admin.deleteUser(user.id);
    if (deleteUser) throw deleteUser;
    return new Response(JSON.stringify({ ok: true }), { status: 200, headers });
  } catch (err) {
    console.error("Account deletion failed", err);
    return new Response(JSON.stringify({ error: "Eliminazione non completata. Contatta l'assistenza per la verifica." }), { status: 500, headers });
  }
});
