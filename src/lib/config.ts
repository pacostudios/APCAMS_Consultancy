/** Business settings. The consultancy runs on Sydney time; every date shown or entered is in this zone. */
export const BUSINESS = {
  name: "APCAMS Consultancy",
  timezone: process.env.BUSINESS_TIMEZONE ?? "Australia/Sydney",
  currency: "AUD",
  locale: "en-AU",
} as const;
