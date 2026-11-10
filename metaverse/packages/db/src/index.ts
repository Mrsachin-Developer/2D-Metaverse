import { config } from "dotenv";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/prisma/client";

const envPaths = [
    resolve(process.cwd(), ".env"),
    resolve(process.cwd(), "../../.env")
];
const envPath = envPaths.find(existsSync);
if (envPath) {
    config({ path: envPath });
}

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
    throw new Error("DATABASE_URL must be set");
}

const adapter = new PrismaPg({ connectionString });
export default new PrismaClient({ adapter });