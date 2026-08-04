import { config } from "dotenv";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import bcrypt from "bcryptjs";
import { dbConnect } from "@/lib/db";
import { User } from "@/models";
import { SEED_ADMIN } from "@/lib/seed-data";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

config({
  path: [resolve(projectRoot, ".env.local"), resolve(projectRoot, ".env")],
  quiet: true,
});

async function main() {
  if (!process.env.MONGODB_URI) {
    console.error(
      "MONGODB_URI is not set. Add it to .env.local (pointing at the production database) or pass it as an environment variable."
    );
    process.exit(1);
  }

  await dbConnect();

  const password = process.env.ADMIN_PASSWORD || SEED_ADMIN.password;
  const hashedPassword = await bcrypt.hash(password, 12);

  const result = await User.updateOne(
    { email: SEED_ADMIN.email },
    {
      $set: {
        name: SEED_ADMIN.name,
        password: hashedPassword,
        role: "admin",
      },
      $setOnInsert: { addresses: [] },
    },
    { upsert: true }
  );

  console.log("\nAdmin credentials updated:");
  console.log(`  Email:    ${SEED_ADMIN.email}`);
  console.log(`  Password: ${password}`);
  console.log(
    result.upsertedCount > 0
      ? "  (new admin user created)"
      : "  (existing admin user updated)"
  );
  process.exit(0);
}

main().catch((error) => {
  console.error("Reset admin failed:", error);
  process.exit(1);
});
