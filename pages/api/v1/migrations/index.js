import migrationRunner from "node-pg-migrate";
import { join } from "node:path";
import database from "infra/database";

export default async function migrations(req, res) {
  const allowedMethos = ["POST", "GET"];
  if (!allowedMethos.includes(req.method)) {
    return res.status(405).json({
      error: `Method ${req.method} not allowed`,
    });
  }
  let dbClient;
  try {
    dbClient = await database.getNewClient();
    const migrationsDefaultOptions = {
      dbClient: dbClient,
      dryRun: true,
      dir: join("infra", "migrations"),
      direction: "up",
      verbose: true,
      migrationsTable: "pgmigrations",
    };

    if (req.method === "GET") {
      const pendingMigrations = await migrationRunner(migrationsDefaultOptions);
      res.status(200).json(pendingMigrations);
    }
    if (req.method === "POST") {
      const migratedMigrations = await migrationRunner({
        ...migrationsDefaultOptions,
        dryRun: false,
      });

      if (migratedMigrations.length > 0) {
        return res.status(201).json(migratedMigrations);
      }
      res.status(200).json(migratedMigrations);
    }
  } catch (error) {
    console.error(errr);
    throw error;
  } finally {
    await dbClient.end();
  }
}
