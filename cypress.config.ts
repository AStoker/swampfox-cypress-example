import { defineConfig } from "cypress";

import { Client } from "pg";

export default defineConfig({
  e2e: {
    baseUrl: "https://localhost:8443",
    setupNodeEvents(on, config) {
      // implement node event listeners here
      on("task", {
        async queryDB(query: string) {
          const client = new Client({
            user: config.env.database.username,
            password: config.env.database.password,
            database: config.env.database.database,
            host: config.env.database.host,
            port: config.env.database.port,
            ssl: config.env.database.ssl,
          });

          return client.connect()
            .then(() => {
              return client.query(query)
                .then((result) => {
                  client.end();
                  return result.rows;
                })
                .catch((error) => {
                  client.end();
                  throw error;
                });
            });
        }
      });
    },
    specPattern: "**/*.e2e.ts",
  },
});
