// TODO: real opening hours are NOT confirmed yet. Keep HOURS_CONFIRMED=false until the owner confirms them;
// while false the open/closed badge is hidden (slot logic still uses HOURS).
export const HOURS_CONFIRMED = false;
// Opening hours in Sofia local time, by weekday (0 = Sunday). PLACEHOLDER — replace with real hours.
export const HOURS: Record<number, [string, string]> = {
  0: ["07:30", "13:00"],
  1: ["06:30", "19:00"],
  2: ["06:30", "19:00"],
  3: ["06:30", "19:00"],
  4: ["06:30", "19:00"],
  5: ["06:30", "19:00"],
  6: ["07:00", "16:00"],
};
export const SLOT_MINUTES = 15;
export const LEAD_MINUTES = 15;
export const TZ = "Europe/Sofia";

const toMin = (s: string) => Number(s.slice(0, 2)) * 60 + Number(s.slice(3, 5));
const toHHMM = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;

export function sofiaParts(d: Date) {
  const p: Record<string, string> = Object.fromEntries(
    new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" })
      .formatToParts(d)
      .map((x) => [x.type, x.value]),
  );
  const date = `${p['year']}-${p['month']}-${p['day']}`;
  return { date, minutes: Number(p['hour']) * 60 + Number(p['minute']), weekday: weekdayOf(date) };
}

export const weekdayOf = (date: string) => new Date(`${date}T12:00:00Z`).getUTCDay();

export function isOpenAt(d: Date) {
  const { minutes, weekday } = sofiaParts(d);
  const [o, c] = HOURS[weekday]!;
  return minutes >= toMin(o) && minutes < toMin(c);
}

/** 15-minute pickup slots for a Sofia date; for today only slots at least LEAD_MINUTES ahead. */
export function slotsFor(date: string, now: Date): string[] {
  const [o, c] = HOURS[weekdayOf(date)]!;
  const today = sofiaParts(now);
  if (date < today.date) return [];
  const earliest = date === today.date ? today.minutes + LEAD_MINUTES : 0;
  const out: string[] = [];
  for (let m = toMin(o); m <= toMin(c) - SLOT_MINUTES; m += SLOT_MINUTES) if (m >= earliest) out.push(toHHMM(m));
  return out;
}

/** Next few days that still have pickup slots. */
export function pickupDays(now: Date, count = 3): string[] {
  const days: string[] = [];
  for (let i = 0; days.length < count && i < 7; i++) {
    const date = sofiaParts(new Date(now.getTime() + i * 86400000)).date;
    if (slotsFor(date, now).length) days.push(date);
  }
  return days;
}

/** Convert Sofia wall-clock date+time into a UTC ISO string. */
export function sofiaToIso(date: string, time: string) {
  const guess = Date.parse(`${date}T${time}:00Z`);
  const p = sofiaParts(new Date(guess));
  const wall = Date.parse(`${p.date}T${toHHMM(p.minutes)}:00Z`);
  return new Date(guess - (wall - guess)).toISOString();
}

export const STAMPS_FOR_FREE = 10;
/** Every 10th pickup order gets one free мекица. */
export const isFreeOrder = (stampsAfterOrder: number) => stampsAfterOrder > 0 && stampsAfterOrder % STAMPS_FOR_FREE === 0;
