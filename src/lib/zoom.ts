import "server-only";
import { BUSINESS } from "./config";

/**
 * Zoom meetings via a Server-to-Server OAuth app (marketplace.zoom.us → Build App → Server-to-Server OAuth).
 * Required scopes: meeting:write:meeting:admin, meeting:update:meeting:admin, meeting:delete:meeting:admin
 * (or the classic meeting:write:admin).
 */

const API = "https://api.zoom.us/v2";

export const isZoomConfigured = () =>
  Boolean(process.env.ZOOM_ACCOUNT_ID && process.env.ZOOM_CLIENT_ID && process.env.ZOOM_CLIENT_SECRET);

// Tokens last an hour; reuse one across requests.
let cachedToken: { value: string; expiresAt: number } | null = null;

async function accessToken() {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) return cachedToken.value;

  const basic = Buffer.from(`${process.env.ZOOM_CLIENT_ID}:${process.env.ZOOM_CLIENT_SECRET}`).toString("base64");
  const res = await fetch(
    `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${process.env.ZOOM_ACCOUNT_ID}`,
    { method: "POST", headers: { Authorization: `Basic ${basic}` } },
  );
  if (!res.ok) throw new Error(`Zoom auth failed (${res.status}): ${await res.text()}`);
  const data = (await res.json()) as { access_token: string; expires_in: number };
  cachedToken = { value: data.access_token, expiresAt: Date.now() + data.expires_in * 1000 };
  return cachedToken.value;
}

async function zoomFetch(path: string, init: RequestInit = {}) {
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${await accessToken()}`, "Content-Type": "application/json" },
  });
  if (!res.ok && res.status !== 404) throw new Error(`Zoom ${init.method ?? "GET"} ${path} failed (${res.status}): ${await res.text()}`);
  return res;
}

/** Zoom wants "yyyy-MM-ddTHH:mm:ssZ" (no milliseconds). */
const zoomTime = (d: Date) => d.toISOString().replace(/\.\d{3}Z$/, "Z");

export type MeetingInput = { topic: string; startsAt: Date; durationMins: number; agenda?: string };

export async function createZoomMeeting({ topic, startsAt, durationMins, agenda }: MeetingInput) {
  const host = process.env.ZOOM_HOST_USER ?? "me";
  const res = await zoomFetch(`/users/${encodeURIComponent(host)}/meetings`, {
    method: "POST",
    body: JSON.stringify({
      topic,
      agenda,
      type: 2, // scheduled
      start_time: zoomTime(startsAt),
      duration: durationMins,
      timezone: BUSINESS.timezone,
      settings: {
        waiting_room: true, // the consultant admits the client
        join_before_host: false,
        host_video: true,
        participant_video: true,
      },
    }),
  });
  const data = (await res.json()) as { id: number; join_url: string };
  return { meetingId: String(data.id), joinUrl: data.join_url };
}

export async function rescheduleZoomMeeting(meetingId: string, startsAt: Date, durationMins: number) {
  await zoomFetch(`/meetings/${meetingId}`, {
    method: "PATCH",
    body: JSON.stringify({ start_time: zoomTime(startsAt), duration: durationMins, timezone: BUSINESS.timezone }),
  });
}

/** Deletes the meeting; a meeting that's already gone is not an error. */
export async function deleteZoomMeeting(meetingId: string) {
  await zoomFetch(`/meetings/${meetingId}`, { method: "DELETE" });
}
