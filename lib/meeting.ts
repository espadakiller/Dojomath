export function getBookingMeetLink() {
  const meetLink = process.env.DOJOMATH_MEET_LINK?.trim();

  if (!meetLink) {
    return undefined;
  }

  try {
    const url = new URL(meetLink);

    if (url.protocol !== "https:" || url.hostname !== "meet.google.com") {
      return undefined;
    }

    return url.toString();
  } catch {
    return undefined;
  }
}
