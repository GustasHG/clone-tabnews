import database from "infra/database.js";
import { InternalServerError } from "infra/errors";

async function status(req, res) {
  try {
    const updatedAt = new Date().toISOString();
    const dataBaseDataVersionResult = await database.query(
      "SHOW server_version;",
    );
    const dataBaseVersion = dataBaseDataVersionResult.rows[0].server_version;

    const databaseMaxConnectionsResult = await database.query(
      "SHOW max_connections;",
    );
    const databaseMaxConnectionsValue =
      databaseMaxConnectionsResult.rows[0].max_connections;

    const dataBaseName = process.env.POSTGRES_DB;

    const databaseOpenedConnectiosResult = await database.query({
      text: "SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1;",
      values: [dataBaseName],
    });
    const databaseOpenedConnectiosValue =
      databaseOpenedConnectiosResult.rows[0].count;
    res.status(200).json({
      updated_at: updatedAt,
      dependencies: {
        database: {
          version: dataBaseVersion,
          max_connections: parseInt(databaseMaxConnectionsValue),
          opened_connections: databaseOpenedConnectiosValue,
        },
      },
    });
  } catch (error) {
    const publicErrorObject = new InternalServerError({
      cause: error,
    });
    console.error(publicErrorObject);
    Response.status(500).json({ error: "internal server error" });
  }
}

export default status;
