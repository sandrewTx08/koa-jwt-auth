import { Context, Next } from "koa";
import { datasource } from "../datasource";
import { User } from "../entity/User";
import {
  signAccessToken,
  verifyAccessToken,
  verifyRefreshToken,
} from "../token";

export function jwtKoa() {
  return async (ctx: Context, next: Next) => {
    ctx.assert(ctx.header.authorization, 401, "Token is required.");
    const header = ctx.header.authorization.split(" ");
    const access_token = verifyAccessToken(header[1]);

    ctx.assert(!access_token.invalid, 400, "Invalid token.");

    const user = await datasource
      .getRepository(User)
      .findOneBy({ id: access_token.id });
    ctx.assert(user, 410, "User may not exist anymore.");
    ctx.assert(user.enable, 403, "User was disabled by system.");

    const refresh_token = verifyRefreshToken(user);

    if (
      access_token.refresh_id !== refresh_token.refresh_id ||
      refresh_token.expired ||
      refresh_token.invalid
    )
      ctx.throw(401, "Token expired, please login again.");
    else if (access_token.expired && !refresh_token.expired)
      ctx.body = signAccessToken(refresh_token.refresh_id, user);
    else if (
      (!access_token.expired && !refresh_token.expired) ||
      (access_token.expired && !refresh_token.expired)
    )
      await next();
    else ctx.throw(500, "Failed trying to verify token.");
  };
}
