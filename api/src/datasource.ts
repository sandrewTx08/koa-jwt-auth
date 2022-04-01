import { config } from "./config";
import { DataSource } from "typeorm";
import { User } from "./entity/User";

export const datasource = new DataSource({
  type: "postgres",
  url: config.TYPEORM_URL,
  synchronize: Boolean(config.TYPEORM_SYNCHRONIZE || true),
  logging: Boolean(config.TYPEORM_LOGGING || false),
  entities: [User], 
});
