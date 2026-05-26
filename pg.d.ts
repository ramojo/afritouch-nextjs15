// `pg`'s package.json `exports` map omits "types", which prevents
// moduleResolution=bundler from discovering @types/pg automatically.
// This shim re-exposes them.
declare module "pg" {
    export * from "@types/pg";
}
