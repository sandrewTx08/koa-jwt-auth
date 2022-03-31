import { config } from "./config";
import { DataSource } from "typeorm";
import { User } from "./entity/User";

export const datasource = new DataSource({
  type: "postgres",
  host: config.TYPEORM_HOST,
  port: Number(config.TYPEORM_PORT),
  username: config.TYPEORM_USERNAME,
  password: config.TYPEORM_PASSWORD,
  database: config.TYPEORM_DATABASE,
  synchronize: Boolean(config.TYPEORM_SYNCHRONIZE || true),
  logging: Boolean(config.TYPEORM_LOGGING || false),
  entities: [User], 
});
