import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { migrate } from "drizzle-orm/mysql2/migrator";
import * as dotenv from "dotenv";
dotenv.config();

async function run() {
    console.log("Connecting to DB...");
    // Force DATABASE_URL from process.env (should be loaded from .env on server)
    // Note: On Beget, PASSENGER_APP_ENV=production might affect things, but .env file is standard.
    if (!process.env.DATABASE_URL) {
        throw new Error("DATABASE_URL is not defined");
    }

    // Explicitly disabling ssl if needed, or default
    const connection = await mysql.createConnection(process.env.DATABASE_URL);
    const db = drizzle(connection);

    console.log("Running migrations from ./migrations...");
    await migrate(db, { migrationsFolder: "./migrations" });
    console.log("Migrations applied successfully!");

    await connection.end();
    process.exit(0);
}

run().catch(err => {
    console.error("Migration failed:", err);
    process.exit(1);
});
