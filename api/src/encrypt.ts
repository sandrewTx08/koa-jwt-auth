import { hash } from "bcrypt";
import { config } from "./config";

export default async function encrypt(data: string) {
  return await hash(data, Number(config.HASH_SALT));
}
