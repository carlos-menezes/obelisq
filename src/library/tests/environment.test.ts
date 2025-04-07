import { describe, it } from "mocha";
import { extendEnvironment } from "../environment";
import assert from "assert";

describe("environment.ts", () => {
  it("should extend the environment", async () => {
    await extendEnvironment({
      entries: {
        TEST_KEY: {
          value: "TEST_VALUE",
          metadata: {
            type: "string",
          },
        },
      },
    });

    assert.equal(
      process.env.TEST_KEY,
      "TEST_VALUE",
      "Environment variable not set correctly",
    );
  });
});
