import database from "infra/database.js";

database.query("SELECT 1+1;");
test("GET to /api/v1/migrations return 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/migrations");
  expect(response.status).toBe(200);

  const responseBody = await response.json();
  console.log(responseBody);
  console.log(process.env.NODE_ENV, "Entrei no teste");

  expect(Array.isArray(responseBody)).toBe(true);
  expect(responseBody.lenght).toBeGreaterThan(0);
});
