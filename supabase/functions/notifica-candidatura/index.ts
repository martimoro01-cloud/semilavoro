// Deploy as Supabase Edge Function "notifica-candidatura" with JWT verification enabled.
// Secrets: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, RESEND_API_KEY, ALLOWED_ORIGINS.
// Configure an authenticated sender domain in Resend before deployment.
import { createClient } from "npm:@supabase/supabase-js@2";

Deno.serve(async (req) => {
  const origin = req.headers.get("origin") ?? "";
  const allowed = (Deno.env.get("ALLOWED_ORIGINS") ?? "").split(",").map(s => s.trim());
  const headers = {
    "Access-Control-Allow-Origin": allowed.includes(origin) ? origin : "",
    "Access-Control-Allow-Headers": "authorization, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json",
  };
  const respond = (status: number, body: object) => new Response(JSON.stringify(body), { status, headers });
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers });
  if (req.method !== "POST" || !allowed.includes(origin)) return respond(403, { error: "Forbidden" });
  const jwt = req.headers.get("Authorization")?.replace(/^Bearer /i, "");
  if (!jwt) return respond(401, { error: "Unauthorized" });

  const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
  const { data: { user }, error: authError } = await admin.auth.getUser(jwt);
  if (authError || !user) return respond(401, { error: "Unauthorized" });

  let candidaturaId: string;
  try {
    const payload = await req.json();
    candidaturaId = payload.candidaturaId;
    if (typeof candidaturaId !== "string" || !/^[0-9a-f-]{36}$/i.test(candidaturaId)) throw Error("Invalid id");
  } catch { return respond(400, { error: "Invalid request" }); }

  const { data: candidatura, error: candidaturaError } = await admin
    .from("candidature").select("id, candidato_id, annuncio_id").eq("id", candidaturaId).maybeSingle();
  if (candidaturaError || !candidatura || candidatura.candidato_id !== user.id) return respond(404, { error: "Not found" });

  const { data: annuncio, error: annuncioError } = await admin
    .from("annunci").select("owner_id").eq("id", candidatura.annuncio_id).maybeSingle();
  if (annuncioError || !annuncio) return respond(404, { error: "Not found" });

  // The email is always looked up server-side from the authenticated owner account.
  const { data: owner, error: ownerError } = await admin.auth.admin.getUserById(annuncio.owner_id);
  const to = owner?.user?.email;
  if (ownerError || !to) return respond(500, { error: "Recipient unavailable" });

  const apiKey = Deno.env.get("RESEND_API_KEY");
  const sender = Deno.env.get("RESEND_FROM_EMAIL");
  if (!apiKey || !sender) return respond(503, { error: "Email service not configured" });

  const site = "https://www.semilavoro.it";
  const escapeHtml = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const html = `<div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;color:#1d332a;line-height:1.6">
    <p>Buongiorno,</p>
    <p>hai ricevuto una nuova candidatura per una delle posizioni che hai pubblicato su <strong>SEMI – Il lavoro educativo cresce qui</strong>.</p>
    <p>Accedi alla tua Area personale per visualizzare la candidatura e consultare il profilo del candidato.</p>
    <p><a href="${site}/area-personale" style="display:inline-block;padding:12px 20px;background:#204b39;color:white;border-radius:8px;text-decoration:none">Visualizza la candidatura</a></p>
    <p>Un caro saluto,<br>Il team di SEMI<br><em>Il lavoro educativo cresce qui</em></p>
  </div>`;
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: sender, to: [to], subject: "Hai ricevuto una nuova candidatura su SEMI!",
        html, text: "Buongiorno,\n\nhai ricevuto una nuova candidatura per una delle posizioni che hai pubblicato su SEMI – Il lavoro educativo cresce qui.\n\nAccedi alla tua Area personale per visualizzare la candidatura e consultare il profilo del candidato.\n\nVisualizza la candidatura: https://www.semilavoro.it/area-personale\n\nUn caro saluto,\nIl team di SEMI\nIl lavoro educativo cresce qui",
      }),
    });
    if (!response.ok) { console.error("Resend error", response.status); return respond(502, { error: "Email delivery failed" }); }
    return respond(200, { ok: true });
  } catch (error) {
    console.error("Email notification error", error);
    return respond(502, { error: "Email delivery failed" });
  }
});
