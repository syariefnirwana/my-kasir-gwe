import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { ArrowLeft, MessageCircle, ShieldCheck, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { requestOtp, verifyOtp } from "@/lib/otp.functions";
import { normalizePhone, formatPhone } from "@/lib/phone";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/masuk")({
  validateSearch: z.object({ redirect: z.string().optional() }),
  head: () => ({
    meta: [
      { title: "Masuk dengan WhatsApp — MyKasirGwe" },
      { name: "description", content: "Masuk atau daftar ke MyKasirGwe cukup dengan nomor WhatsApp dan kode OTP." },
      { property: "og:title", content: "Masuk dengan WhatsApp — MyKasirGwe" },
      { property: "og:description", content: "Masuk atau daftar cukup dengan nomor WhatsApp." },
    ],
  }),
  component: LoginPage,
});

function safeRedirect(r?: string) {
  return r && r.startsWith("/") && !r.startsWith("//") ? r : "/akun";
}

function LoginPage() {
  const { redirect } = Route.useSearch();
  const navigate = useNavigate();
  const sendOtp = useServerFn(requestOtp);
  const checkOtp = useServerFn(verifyOtp);

  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [normalized, setNormalized] = useState("");
  const [code, setCode] = useState("");
  const [simCode, setSimCode] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSend(e?: React.FormEvent) {
    e?.preventDefault();
    const n = normalizePhone(phone);
    if (!n) return toast.error("Nomor WhatsApp tidak valid. Contoh: 0812xxxxxxx");
    setBusy(true);
    try {
      const res = await sendOtp({ data: { phone: n } });
      if (!res.ok) return toast.error(res.error);
      setNormalized(res.phone);
      setSimCode(res.simulatedCode);
      setCode("");
      setStep("otp");
      toast.success("Kode OTP terkirim");
    } catch {
      toast.error("Gagal mengirim kode. Coba lagi.");
    } finally {
      setBusy(false);
    }
  }

  async function onVerify(value = code) {
    if (value.length !== 4) return;
    setBusy(true);
    try {
      const res = await checkOtp({ data: { phone: normalized, code: value } });
      if (!res.ok) {
        setCode("");
        return toast.error(res.error);
      }
      const { error } = await supabase.auth.verifyOtp({ token_hash: res.tokenHash, type: "magiclink" });
      if (error) return toast.error("Gagal masuk. Coba lagi.");
      toast.success("Berhasil masuk");
      navigate({ to: safeRedirect(redirect) });
    } catch {
      toast.error("Terjadi kesalahan. Coba lagi.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="bg-hero">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md flex-col justify-center px-4 py-10">
        <div className="rounded-3xl border bg-card p-6 shadow-lift sm:p-8">
          <div className="mb-6 grid h-12 w-12 place-items-center rounded-2xl bg-success-soft text-success">
            {step === "phone" ? <MessageCircle className="h-6 w-6" /> : <ShieldCheck className="h-6 w-6" />}
          </div>

          {step === "phone" ? (
            <form onSubmit={onSend} className="space-y-5">
              <div>
                <h1 className="text-2xl font-bold">Masuk atau Daftar</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  Cukup pakai nomor WhatsApp. Kami kirim kode 4 digit.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Nomor WhatsApp</Label>
                <div className="flex items-center overflow-hidden rounded-lg border border-input bg-background focus-within:ring-2 focus-within:ring-ring">
                  <span className="px-3 text-sm font-semibold text-muted-foreground">+62</span>
                  <Input
                    id="phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder="812 3456 7890"
                    value={phone}
                    maxLength={20}
                    onChange={(e) => setPhone(e.target.value)}
                    className="h-12 border-0 bg-transparent text-base shadow-none focus-visible:ring-0"
                  />
                </div>
              </div>
              <Button type="submit" size="lg" variant="whatsapp" className="w-full" disabled={busy}>
                {busy && <Loader2 className="animate-spin" />} Kirim Kode OTP
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                Dengan masuk, kamu menyetujui ketentuan layanan MyKasirGwe.
              </p>
            </form>
          ) : (
            <div className="space-y-5">
              <button
                type="button"
                onClick={() => setStep("phone")}
                className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4" /> Ganti nomor
              </button>
              <div>
                <h1 className="text-2xl font-bold">Masukkan Kode</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  Kode dikirim ke <span className="font-semibold text-foreground">{formatPhone(normalized)}</span>
                </p>
              </div>
              {simCode && (
                <div className="rounded-xl border border-dashed border-warning bg-warning/10 p-3 text-sm">
                  <span className="font-semibold">Mode simulasi:</span> kode OTP kamu adalah{" "}
                  <span className="font-display text-lg font-bold tracking-widest">{simCode}</span>
                </div>
              )}
              <div className="flex justify-center">
                <InputOTP
                  maxLength={4}
                  value={code}
                  inputMode="numeric"
                  onChange={(v) => {
                    setCode(v);
                    if (v.length === 4) void onVerify(v);
                  }}
                >
                  <InputOTPGroup className="gap-3">
                    {[0, 1, 2, 3].map((i) => (
                      <InputOTPSlot key={i} index={i} className="h-14 w-14 rounded-xl border text-xl font-bold" />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              </div>
              <Button size="lg" className="w-full" disabled={busy || code.length !== 4} onClick={() => onVerify()}>
                {busy && <Loader2 className="animate-spin" />} Verifikasi
              </Button>
              <Button variant="ghost" className="w-full" disabled={busy} onClick={() => onSend()}>
                Kirim ulang kode
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
