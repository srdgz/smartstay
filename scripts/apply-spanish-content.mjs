import { createClient } from "@sanity/client";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const shouldWrite = process.argv.includes("--write");

const env = {};
for (const line of readFileSync(join(root, ".env.local"), "utf8").split(/\r?\n/)) {
  const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
  if (match) env[match[1]] = match[2].replace(/^"|"$/g, "");
}

const content = JSON.parse(readFileSync(join(root, "scripts", "rooms.es.json"), "utf8"));

const client = createClient({
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: env.NEXT_PUBLIC_SANITY_DATASET,
  token: env.SANITY_STUDIO_TOKEN,
  apiVersion: "2024-01-23",
  useCdn: false,
});

const rooms = await client.fetch(
  `*[_type == "hotelRoom"]{_id, "slug": slug.current, name, name_es, description_es, specialNote_es, offeredAmenities}`
);

let changes = 0;

for (const room of rooms) {
  const translation = content.rooms[room.slug];
  if (!translation) {
    console.log(`skip   ${room.slug}: no translation in rooms.es.json`);
    continue;
  }

  const fields = {};
  if (!room.name_es) fields.name_es = translation.name_es;
  if (!room.description_es) fields.description_es = translation.description_es;
  if (!room.specialNote_es) fields.specialNote_es = content.specialNote;

  for (const amenity of room.offeredAmenities ?? []) {
    const spanish = content.amenities[(amenity.amenity ?? "").trim()];
    if (spanish && !amenity.amenity_es) {
      fields[`offeredAmenities[_key=="${amenity._key}"].amenity_es`] = spanish;
    }
  }

  const count = Object.keys(fields).length;
  if (!count) {
    console.log(`ok     ${room.slug}: already translated`);
    continue;
  }

  changes += count;
  console.log(`${shouldWrite ? "write " : "plan  "} ${room.slug}: ${count} field(s)`);
  for (const [field, value] of Object.entries(fields)) {
    console.log(`         ${field} = ${JSON.stringify(value).slice(0, 70)}`);
  }

  if (shouldWrite) await client.patch(room._id).set(fields).commit();
}

console.log(
  shouldWrite
    ? `\nDone: ${changes} field(s) written.`
    : `\nDry run: ${changes} field(s) would be written. Run again with --write to apply.`
);
