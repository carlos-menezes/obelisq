# CHANGELOG

## 0.2.0 (yyyy-mm-dd)

- Multiple files can now be used as input:
  - `-f` can be used multiple times;
  - `TSetupParams` has been modified to accept a list of files;
- Changed behaviour of the default command (`run`):
  - `obelisq [run] <script>` has been replaced with `obelisq [run] -s "<script>"`, e.g. `obelisq -s "node -e \"console.log('Hello world')\"`;
