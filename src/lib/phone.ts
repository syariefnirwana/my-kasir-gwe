/** Normalize Indonesian WhatsApp numbers to 62xxxxxxxxxx. Returns null if invalid. */
export function normalizePhone(input: string): string | null {
  let d = input.replace(/\D/g, "");
  if (d.startsWith("0")) d = "62" + d.slice(1);
  else if (d.startsWith("8")) d = "62" + d;
  if (!/^628\d{7,12}$/.test(d)) return null;
  return d;
}

export function formatPhone(p: string | null | undefined): string {
  if (!p) return "-";
  return "+" + p.replace(/^(\d{2})(\d{3})(\d{4})(\d+)$/, "$1 $2-$3-$4");
}

export function syntheticEmail(phone: string) {
  return `wa${phone}@users.mykasirgwe.app`;
}
