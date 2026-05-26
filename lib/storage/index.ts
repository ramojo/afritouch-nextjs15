import { config } from "@/lib/config";
import fileStorage from "./file";
import pgStorage from "./postgres";
import { Storage } from "./types";

const storage: Storage =
    config.storage.driver === "postgres" ? pgStorage : fileStorage;

export default storage;
export type { Storage } from "./types";
