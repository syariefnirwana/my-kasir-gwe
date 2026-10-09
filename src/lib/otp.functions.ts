import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { normalizePhone, syntheticEmail } from "./phone";

const phoneSchema = z.object({ phone: z.string().trim().min(8).max(20) });
const verifySchema = phoneSchema.extend({ code: z.string().regex(/^\d{4}$/) });

async function sha256(text: string) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Simulated WhatsApp OTP: code is generated + stored hashed, and returned to the
 * client so it can be shown on screen until a real WhatsApp provider is connected.
 */
export const requestOtp = createServerFn({ method: "POST" })
  .inputValidator((d) => phoneSchema.parse(d))
  .handler(async ({ data }) => {
    const phone = normalizePhone(data.phone);
    if (!phone) return { ok: false as const, error: "Nomor WhatsApp tidak valid." };
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: last } = await supabaseAdmin
      .from("otp_codes")
      .select("created_at")
      .eq("phone_number", phone)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (last && Date.now() - new Date(last.created_at).getTime() < 30_000) {
      return { ok: false as const, error: "Tunggu 30 detik sebelum meminta kode baru." };
    }

    const rnd = new Uint32Array(1);
    crypto.getRandomValues(rnd);
    const code = String(rnd[0] % 10000).padStart(4, "0");
    const { error } = await supabaseAdmin.from("otp_codes").insert({
      phone_number: phone,
      code_hash: await sha256(`${phone}:${code}`),
      expires_at: new Date(Date.now() + 5 * 60_000).toISOString(),
    });
    if (error) {
      console.error("otp insert", error);
      return { ok: false as const, error: "Gagal membuat kode. Coba lagi." };
    }
    return { ok: true as const, phone, simulatedCode: code };
  });

export const verifyOtp = createServerFn({ method: "POST" })
  .inputValidator((d) => verifySchema.parse(d))
  .handler(async ({ data }) => {
    const phone = normalizePhone(data.phone);
    if (!phone) return { ok: false as const, error: "Nomor WhatsApp tidak valid." };
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: otp } = await supabaseAdmin
      .from("otp_codes")
      .select("*")
      .eq("phone_number", phone)
      .is("consumed_at", null)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (!otp || new Date(otp.expires_at).getTime() < Date.now()) {
      return { ok: false as const, error: "Kode kedaluwarsa. Minta kode baru." };
    }
    if (otp.attempts >= 5) {
      return { ok: false as const, error: "Terlalu banyak percobaan. Minta kode baru." };
    }
    if ((await sha256(`${phone}:${data.code}`)) !== otp.code_hash) {
      await supabaseAdmin.from("otp_codes").update({ attempts: otp.attempts + 1 }).eq("id", otp.id);
      return { ok: false as const, error: "Kode salah. Periksa kembali." };
    }
    await supabaseAdmin
      .from("otp_codes")
      .update({ consumed_at: new Date().toISOString() })
      .eq("id", otp.id);

    // Find or create the account bound to this phone
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("id, email")
      .eq("phone_number", phone)
      .maybeSingle();
    let email = profile?.email ?? syntheticEmail(phone);
    if (!profile) {
      const { data: created, error } = await supabaseAdmin.auth.admin.createUser({
        email,
        email_confirm: true,
        user_metadata: { phone_number: phone },
      });
      if (error || !created.user) {
        console.error("createUser", error);
        return { ok: false as const, error: "Gagal membuat akun." };
      }
      email = created.user.email ?? email;
    }

    const { data: link, error: linkErr } = await supabaseAdmin.auth.admin.generateLink({
      type: "magiclink",
      email,
    });
    if (linkErr || !link.properties?.hashed_token) {
      console.error("generateLink", linkErr);
      return { ok: false as const, error: "Gagal membuat sesi." };
    }
    return { ok: true as const, tokenHash: link.properties.hashed_token };
  });
