import { config } from "./config";
import { User } from "./entity/User";
import { sign, verify } from "jsonwebtoken";

export let ACCESS_EXP = config.JWT_ACCESS_TOKEN_EXP;
export let ACCESS = config.JWT_ACCESS_TOKEN;
export let REFRESH_EXP = config.JWT_REFRESH_TOKEN_EXP;
export let REFRESH = config.JWT_REFRESH_TOKEN;

export function signAccessToken(refresh_id: string, user: User) {
  return sign({ refresh_id, user_id: user.id }, ACCESS, {
    expiresIn: String(ACCESS_EXP),
  });
}

export function signRefreshToken(uuid: string, user: User) {
  return sign({ refresh_id: uuid, user_id: user.id }, REFRESH, {
    expiresIn: String(REFRESH_EXP),
  });
}

export function verifyAccessToken(token: string) {
  const payload = Object(
    verify(token, ACCESS, {
      ignoreExpiration: true,
    })
  );

  if (Date.now() >= payload.exp * 1000) return { expired: true, ...payload };
  else return { expired: false, ...payload };
}

export function verifyRefreshToken(user: User) {
  const payload = Object(
    verify(user.refresh_token, REFRESH, {
      ignoreExpiration: true,
    })
  );

  if (Date.now() >= payload.exp * 1000) return { expired: true, ...payload };
  else return { expired: false, ...payload };
}
