/**
 * Checks the Zoom credentials end to end: creates a test meeting for tomorrow, prints its link, then deletes it.
 *
 *   npm run zoom:check
 */
import { createZoomMeeting, deleteZoomMeeting, isZoomConfigured } from "../src/lib/zoom";

async function main() {
  if (!isZoomConfigured()) {
    console.error("✗ Set ZOOM_ACCOUNT_ID, ZOOM_CLIENT_ID and ZOOM_CLIENT_SECRET in .env.local first.");
    process.exit(1);
  }
  console.log(`Creating a test meeting hosted by "${process.env.ZOOM_HOST_USER ?? "me"}"…`);

  const startsAt = new Date(Date.now() + 24 * 3_600_000);
  const { meetingId, joinUrl } = await createZoomMeeting({
    topic: "Alchemetanoia connection test (safe to ignore)",
    startsAt,
    durationMins: 60,
  });
  console.log(`✓ Created meeting ${meetingId}\n  ${joinUrl}`);

  await deleteZoomMeeting(meetingId);
  console.log("✓ Deleted it again. Zoom is set up correctly.");
}

main().catch((e) => {
  console.error("✗ Zoom check failed:\n ", e instanceof Error ? e.message : e);
  process.exit(1);
});
