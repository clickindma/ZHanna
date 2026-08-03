import { config } from "dotenv";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { dbConnect } from "@/lib/db";
import { clearDatabase, seedDatabase } from "@/lib/seed";
import { SEED_ADMIN } from "@/lib/seed-data";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

config({
  path: [resolve(projectRoot, ".env.local"), resolve(projectRoot, ".env")],
  quiet: true,
});

async function main() {
  const reset = process.argv.includes("--reset") || process.argv.includes("--clear");

  if (!process.env.MONGODB_URI) {
    console.error(
      "MONGODB_URI is not set. Add it to .env.local or pass it as an environment variable."
    );
    process.exit(1);
  }

  await dbConnect();

  if (reset) {
    console.log("Resetting database…");
    await clearDatabase();
  }

  const summary = await seedDatabase();

  console.log("\nSeed complete:");
  console.log(JSON.stringify(summary, null, 2));
  console.log("\nAdmin credentials:");
  console.log(`  Email:    ${SEED_ADMIN.email}`);
  console.log(`  Password: ${SEED_ADMIN.password}`);
  console.log("\nRun again with --reset to wipe collections first.");
  process.exit(0);
}

main().catch((error) => {
  console.error("Seeding failed:", error);
  process.exit(1);
});
