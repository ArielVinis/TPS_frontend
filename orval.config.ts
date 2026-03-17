import { defineConfig } from "orval";
import "dotenv/config";

export default defineConfig({
  // rc: {
  //   output: {
  //     target: "lib/api/rc-generated/index.ts",
  //     client: "react-query",
  //     override: {
  //       mutator: {
  //         path: "./lib/api/axios-instance.ts",
  //         name: "customInstance",
  //       },
  //     },
  //   },
  //   input: {
  //     target: `${process.env.NEXT_PUBLIC_API_URL}/swagger.json`,
  //     filters: {
  //       mode: "exclude",
  //       tags: ["default"],
  //     },
  //   },
  // },
  // Client gerado a partir do OpenAPI da TPS.AI (GET /swagger.json).
  // Rodar com a API levantada: npm run generate:api
  fetch: {
    input: `${process.env.NEXT_PUBLIC_API_URL}/swagger.json`,
    output: {
      target: "./src/app/_lib/api/fetch-generated/index.ts",
      client: "fetch",
      prettier: true,
      override: {
        mutator: {
          path: "./src/app/_lib/fetch.ts",
          name: "customFetch",
        },
      },
    },
  },
});
