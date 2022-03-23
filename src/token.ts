import { config } from "./config";
import { User } from "./entity/User";
import {
  sign,
  verify,
  TokenExpiredError,
  JsonWebTokenError,
} from "jsonwebtoken";

export function signAccessToken(refresh_id: string, user: User) {
  return sign({ refresh_id, user_id: user.id }, config.JWT_ACCESS_TOKEN, {
    expiresIn: String(config.JWT_ACCESS_TOKEN_EXP),
  });
}

export function signRefreshToken(uuid: string, user: User) {
  return sign(
    { refresh_id: uuid, user_id: user.id },
    config.JWT_REFRESH_TOKEN,
    {
      expiresIn: String(config.JWT_REFRESH_TOKEN_EXP),
    }
  );
}

export function verifyAccessToken(token: string) {
  try {
    let payload = Object(
      verify(token, config.JWT_ACCESS_TOKEN, { ignoreExpiration: true })
    );
    try {
      payload = Object(verify(token, config.JWT_ACCESS_TOKEN));
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
      verify(user.refresh_token, config.JWT_REFRESH_TOKEN, {
        ignoreExpiration: true,
      })
    );
    try {
      payload = Object(verify(user.refresh_token, config.JWT_REFRESH_TOKEN));
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
