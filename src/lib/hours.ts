import { z } from "zod";

const time = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Times must be HH:MM.");
const hoursSchema = z.array(z.object({ weekday: z.number().int().min(0).max(6), startTime: time, endTime: time }));

export type HoursBlock = z.infer<typeof hoursSchema>[number];

/** Reads the HoursEditor's JSON field and checks every block. Returns the rows, or an error message. */
export function parseHoursForm(formData: FormData): { rows: HoursBlock[] } | { error: string } {
  let rows;
  try {
    rows = hoursSchema.parse(JSON.parse(String(formData.get("hours"))));
  } catch {
    return { error: "Couldn't read the hours. Check every time is filled in." };
  }

  for (const r of rows) {
    if (r.startTime >= r.endTime) return { error: "Each block must end after it starts." };
  }
  // Blocks on the same day must not overlap.
  for (let day = 0; day < 7; day++) {
    const blocks = rows.filter((r) => r.weekday === day).sort((a, b) => a.startTime.localeCompare(b.startTime));
    for (let i = 1; i < blocks.length; i++) {
      if (blocks[i].startTime < blocks[i - 1].endTime) return { error: "Two time blocks on the same day overlap." };
    }
  }
  return { rows };
}
