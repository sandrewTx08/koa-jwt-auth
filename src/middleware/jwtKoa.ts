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

    let access_token;
    try {
      access_token = verifyAccessToken(header[1]);
    } catch (error) {
      ctx.throw(400, "Invalid token.", error);
    }

    const user = await datasource
      .getRepository(User)
      .findOneBy({ id: access_token.id });
    ctx.assert(user, 410, "User may not exist anymore.");
    ctx.assert(user.enable, 403, "User was disabled by system.");

    let refresh_token;
    try {
      refresh_token = verifyRefreshToken(user);
    } catch (error) {
      ctx.throw(500, "Failed trying to verify refresh token.", error);
    }

    if (
      access_token.refresh_id !== refresh_token.refresh_id ||
      refresh_token.expired
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
