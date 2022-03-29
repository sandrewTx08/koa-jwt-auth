import { config } from "./config";
import { User } from "./entity/User";
import {
  sign,
  verify,
  TokenExpiredError,
  JsonWebTokenError,
} from "jsonwebtoken";

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
  try {
    let payload = Object(verify(token, ACCESS, { ignoreExpiration: true }));
    try {
      payload = Object(verify(token, ACCESS));
      return { expired: false, ...payload };
    } catch (err) {
      if (err instanceof TokenExpiredError)
        return { expired: true, ...payload };
    }
  } catch (err) {
    if (err instanceof JsonWebTokenError) return { invalid: true };
    else throw err;
  }
}

export function verifyRefreshToken(user: User) {
  try {
    let payload = Object(
      verify(user.refresh_token, REFRESH, {
        ignoreExpiration: true,
      })
    );
    try {
      payload = Object(verify(user.refresh_token, REFRESH));
      return { expired: false, ...payload };
    } catch (err) {
      if (err instanceof TokenExpiredError)
        return { expired: true, ...payload };
    }
  } catch (err) {
    if (err instanceof JsonWebTokenError) return { invalid: true };
    else throw err;
  }
}
