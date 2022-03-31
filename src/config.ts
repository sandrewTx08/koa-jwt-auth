import { config as Config } from "dotenv";
export const config = { ...Config().parsed, ...process.env };
