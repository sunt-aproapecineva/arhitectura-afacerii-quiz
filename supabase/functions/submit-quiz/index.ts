import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function isString(v: unknown): v is string {
  return typeof v === "string";
}

function clamp(s: string, max: number): string {
  return s.slice(0, max);
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// A: tipologii business · B: persona începători (ramura START)
const VALID_PROFILES = ["R", "Re", "M", "D", "C", "S", "ANGAJAT", "ARS", "ZERO", ""];
const VALID_TEMPS = ["HOT", "WARM", "COLD", ""];

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();

    // --- Validate required fields ---
    const sessionId = body.sessionId;
    if (!isString(sessionId) || sessionId.length < 10 || sessionId.length > 100) {
      return new Response(JSON.stringify({ error: "Invalid sessionId" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const contact = body.contact;
    if (!contact || typeof contact !== "object") {
      return new Response(JSON.stringify({ error: "Missing contact" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const name = isString(contact.name) ? clamp(contact.name.trim(), 200) : "";
    const email = isString(contact.email) ? clamp(contact.email.trim(), 255) : "";
    const phone = isString(contact.phone) ? clamp(contact.phone.trim(), 30) : "";
    const instagram = isString(contact.instagram) ? clamp(contact.instagram.trim(), 100) : "";

    if (!name) {
      return new Response(JSON.stringify({ error: "Name is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (email && !EMAIL_RE.test(email)) {
      return new Response(JSON.stringify({ error: "Invalid email format" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // --- Validate profile ---
    const profile = body.profile;
    const profilePrimary = isString(profile?.primary) && VALID_PROFILES.includes(profile.primary) ? profile.primary : "";
    const profileSecondary = isString(profile?.secondary) && VALID_PROFILES.includes(profile.secondary) ? profile.secondary : "";
    const profileTemperature = isString(profile?.temperature) && VALID_TEMPS.includes(profile.temperature) ? profile.temperature : "";

    // --- Limit raw_data size (prevent oversized payloads) ---
    const rawJson = JSON.stringify(body);
    if (rawJson.length > 50_000) {
      return new Response(JSON.stringify({ error: "Payload too large" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // --- Insert via service role (bypasses RLS) ---
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { error: dbError } = await supabase.from("quiz_submissions").insert({
      session_id: sessionId,
      contact_name: name,
      contact_email: email,
      contact_phone: phone,
      contact_instagram: instagram,
      profile_primary: profilePrimary,
      profile_secondary: profileSecondary,
      profile_temperature: profileTemperature,
      raw_data: body,
    });

    if (dbError) {
      console.error("[submit-quiz] DB error:", dbError);
      return new Response(JSON.stringify({ error: "Failed to save submission" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[submit-quiz] Error:", err);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
