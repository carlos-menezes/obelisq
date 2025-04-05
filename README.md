# `@obelisq/env`

> [!CAUTION]
> This library/CLI hasn't been published to the `npm` registry yet as many features are missing.

## Install

```ts
pnpm add @obelisq/env
```

## Usage

Create a `.env` file in the root directory of your project, e.g.:

```sh
SUPER_SECRET_KEY=your_secret_key
API_VERSION=2
```

In the entrypoint to your app (e.g. `index.ts`), call `setup` to load your `.env` into Node's `process.env`:

```ts
// index.ts
import { setup } from "@obelisq/env";

// Takes additional, optional configuration.
// Returns a list of entries (`TEnvironmentLineKeyValue`) which may be used for e.g. validation purposes.
await setup();
```

> [!CAUTION]
> The feature below is partially available.

You can also run `$ obelisq -- <script>` to load the environment variables into `process.env`.

## Type-safety

You can generate a library which provides minimal type-safety when accessing the environment variables.

```sh
obelisq generate [-o <string>]
```

This will output `obelisq.ts` (unless specified differently with `-o` — "output path") which exports `environment`, a function which takes a single argument of type `TObelisqEnvironmentKeys`. What is `TObelisqEnvironmentKeys`? It's a type that extends a `Record` where the `keys` are the keys of your environment file and the values are the (assumed) type of the value, e.g.:

```ts
type TObelisqEnvironmentKeys = {
  SUPER_SECRET_KEY: string;
  API_VERSION: number;
};
```
