import migrationRunner from "node-pg-migrate";
import database from "infra/database";
import { createRouter } from "next-connect";
import { resolve } from "node:path";
import controller from "infra/controller";

const router = createRouter();

router.get(getHandler);
router.post(postHandler);

export default router.handler(controller.errorHandlers);

const migrationsDefaultOptions = {
  dryRun: true,
  dir: resolve("infra", "migrations"),
  direction: "up",
  verbose: true,
  migrationsTable: "pgmigrations",
};

async function getHandler(req, res) {
  let dbClient;
  try {
    dbClient = await database.getNewClient();

    const pendingMigrations = await migrationRunner({
      ...migrationsDefaultOptions,
      dbClient,
    });
    res.status(200).json(pendingMigrations);
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await dbClient.end();
  }
}

async function postHandler(req, res) {
  let dbClient;
  try {
    dbClient = await database.getNewClient();

    const migratedMigrations = await migrationRunner({
      ...migrationsDefaultOptions,
      dryRun: false,
      dbClient,
    });

    if (migratedMigrations.length > 0) {
      return res.status(201).json(migratedMigrations);
    }
    res.status(200).json(migratedMigrations);
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await dbClient.end();
  }
}
