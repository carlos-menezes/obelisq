# `@obelisq/env`

> [!CAUTION]
> This library/CLI hasn't been published to the `npm` registry yet as many features are missing.

Load your `.env`s into `process.env` and generate a small library for accessing these values in a type safe way.

Say your `.env` looks like this:

```txt
SUPER_SECRET_KEY=your_secret_key
API_VERSION=2
```

Run `$ obelisq` to load these into `process.env` and if you want type-safety when acessing these variables, run `$ obelisq generate`. The latter will output a file named (by default) `obelisq.ts` which exports a single function, `environment`, which allows to safely access your variables:

![](https://i.imgur.com/OrKw6AY.png)
