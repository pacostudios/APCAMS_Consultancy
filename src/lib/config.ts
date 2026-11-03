/** Business settings. The consultancy runs on Sydney time; every date shown or entered is in this zone. */
export const BUSINESS = {
  name: "APCAMS Consultancy",
  timezone: process.env.BUSINESS_TIMEZONE ?? "Australia/Sydney",
  currency: "AUD",
  locale: "en-AU",
  /** Customers can cancel online up to this many hours before a session. */
  cancelNoticeHours: 24,
  /** Most upcoming sessions one customer can hold at once (stops slot hoarding). */
  maxUpcomingPerClient: 3,
} as const;
