import orchestrator from "../orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
});

test("GET to /api/v1/status should return 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/status");
  expect(response.status).toBe(200);

  const responseBody = await response.json();

  //definições de teste para a data:
  const parsedUpatedAt = new Date(responseBody.updated_at).toISOString();
  expect(responseBody.updated_at).toEqual(parsedUpatedAt);

  //definições de teste para db_version
  const dbVersion = responseBody.dependencies.database.db_version;
  expect(dbVersion).toEqual("16.0");

  //definições de teste para max_conn
  const maxConn = responseBody.dependencies.database.max_conn;
  expect(maxConn).toEqual(100);

  //definições de teste para use_conn
  const useConn = responseBody.dependencies.database.use_conn;
  expect(useConn).toEqual(1);
});
