import { describe, it } from "mocha";
import { extendEnvironment } from "../environment";
import assert from "assert";

describe("environment.ts", () => {
  it("should extend the environment", async () => {
    await extendEnvironment({
      entries: [{ key: "TEST_KEY", value: "TEST_VALUE", kind: "key-value" }],
    });

    assert.equal(
      process.env.TEST_KEY,
      "TEST_VALUE",
      "Environment variable not set correctly"
    );
  });
});
