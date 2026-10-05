function withText(base: string, text?: string): string {
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

export function telegramLink(username: string, text?: string): string {
  return withText(`https://t.me/${username.replace(/^@/, "")}`, text);
}

export function whatsappLink(phone: string, text?: string): string {
  return withText(`https://wa.me/${phone.replace(/\D/g, "")}`, text);
}
