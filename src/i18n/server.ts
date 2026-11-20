import "server-only";
import { cookies } from "next/headers";
import { LANG_COOKIE, toLang } from "./config";
import { dictionaries } from "./dictionaries";

/** The visitor's chosen language, from their cookie (English if unset). */
export async function getLang() {
  return toLang((await cookies()).get(LANG_COOKIE)?.value);
}

/** Strings for server components in the visitor's language. */
export async function getT() {
  return dictionaries[await getLang()];
}
