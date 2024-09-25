import { createClient } from "@sanity/client";

export const client = createClient({
  projectId: "pxzq49ws",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
});
