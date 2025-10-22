import database from "infra/database.js";

async function status(request, response) {
  const updatedAt = new Date().toISOString();
  const dbVersion = (await database.query("SHOW server_version;")).rows[0]
    .server_version;
  const maxConn = (await database.query("SHOW max_connections;")).rows[0]
    .max_connections;
  const databaseName = process.env.POSTGRES_DB;
  const useConn = (
    await database.query({
      text: "SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1",
      values: [databaseName],
    })
  ).rows[0].count;

  response.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        db_version: dbVersion,
        max_conn: parseInt(maxConn),
        use_conn: useConn,
      },
    },
  });
}

export default status;
