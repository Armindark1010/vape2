export const money = (n: number) => `${n.toLocaleString("en-US")} تومان`;

const MONTHS = ["ژانویه", "فوریه", "مارس", "آوریل", "مه", "ژوئن", "ژوئیه", "اوت", "سپتامبر", "اکتبر", "نوامبر", "دسامبر"];

export function formatDateFa(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()} ${MONTHS[d.getMonth()]} ${d.getDate()}`;
}
