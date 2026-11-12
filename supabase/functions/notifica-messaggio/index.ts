// Supabase Edge Function: notifica-messaggio
// Requires RESEND_API_KEY, RESEND_FROM_EMAIL, ALLOWED_ORIGINS and Supabase default secrets.
// Keep JWT verification enabled; authenticate the sender and derive the recipient server-side.
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

  let messageId: string;
  try {
    const payload = await req.json();
    messageId = payload.messageId;
    if (typeof messageId !== "string" || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(messageId)) throw Error("Invalid id");
  } catch { return respond(400, { error: "Invalid request" }); }

  const { data: message, error: messageError } = await admin
    .from("messaggi_candidatura").select("id, candidatura_id, mittente_id").eq("id", messageId).maybeSingle();
  if (messageError || !message || message.mittente_id !== user.id) return respond(404, { error: "Not found" });

  const { data: application, error: applicationError } = await admin
    .from("candidature").select("candidato_id, annuncio_id").eq("id", message.candidatura_id).maybeSingle();
  if (applicationError || !application) return respond(404, { error: "Not found" });

  const { data: posting, error: postingError } = await admin
    .from("annunci").select("owner_id").eq("id", application.annuncio_id).maybeSingle();
  if (postingError || !posting?.owner_id) return respond(404, { error: "Not found" });

  // Only the two participants can send and trigger notifications.
  if (user.id !== application.candidato_id && user.id !== posting.owner_id) return respond(403, { error: "Forbidden" });
  const recipientId = user.id === application.candidato_id ? posting.owner_id : application.candidato_id;
  if (recipientId === user.id) return respond(400, { error: "Invalid recipient" });

  const { data: recipient, error: recipientError } = await admin.auth.admin.getUserById(recipientId);
  if (recipientError || !recipient?.user?.email) return respond(500, { error: "Recipient unavailable" });

  const apiKey = Deno.env.get("RESEND_API_KEY");
  const sender = Deno.env.get("RESEND_FROM_EMAIL");
  if (!apiKey || !sender) return respond(503, { error: "Email service not configured" });

  const link = "https://www.semilavoro.it/area-personale";
  const html = `<div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;color:#1d332a;line-height:1.6">
    <p>Buongiorno,</p>
    <p>hai ricevuto un nuovo messaggio su <strong>SEMI – Il lavoro educativo cresce qui</strong>.</p>
    <p>Accedi alla tua Area personale per leggere il messaggio e continuare la conversazione.</p>
    <p><a href="${link}" style="display:inline-block;padding:12px 20px;background:#204b39;color:white;border-radius:8px;text-decoration:none">Visualizza il messaggio</a></p>
    <p>Un caro saluto,<br>Il team di SEMI<br><em>Il lavoro educativo cresce qui</em></p>
  </div>`;
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: sender,
        to: [recipient.user.email],
        subject: "Hai ricevuto un nuovo messaggio su SEMI!",
        html,
        text: "Buongiorno,\n\nhai ricevuto un nuovo messaggio su SEMI – Il lavoro educativo cresce qui.\n\nAccedi alla tua Area personale per leggere il messaggio e continuare la conversazione.\n\nVisualizza il messaggio: https://www.semilavoro.it/area-personale\n\nUn caro saluto,\nIl team di SEMI\nIl lavoro educativo cresce qui",
      }),
    });
    if (!response.ok) { console.error("Resend error", response.status); return respond(502, { error: "Email delivery failed" }); }
    return respond(200, { ok: true });
  } catch (error) {
    console.error("Message notification failed", error);
    return respond(502, { error: "Email delivery failed" });
  }
});
