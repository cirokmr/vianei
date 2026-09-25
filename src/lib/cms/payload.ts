import "server-only";
import config from "@payload-config";
import { getPayload } from "payload";

/** Payload Local API: queries go straight to Postgres, no HTTP round trip. */
export function payload() {
  return getPayload({ config });
}
