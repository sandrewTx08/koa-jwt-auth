import { compare } from "bcrypt";
import { v4 } from "uuid";
import { Context } from "koa";
import { User } from "../entity/User";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../token";
import encrypt from "../encrypt";
import { datasource } from "../datasource";

export class UserController {
  static async authenticatePassword(ctx: Context) {
    ctx.assert(
      ctx.request.body.username || ctx.request.body.email,
      400,
      "Username or email is empty."
    );

    const user = await datasource.getRepository(User).findOneBy({
      username: ctx.request.body.username,
      email: ctx.request.body.email,
    });

    ctx.assert(
      await compare(ctx.request.body.password, user.password),
      400,
      "Invalid password"
    );

    const refresh_token = verifyRefreshToken(user);
    let refresh_id;
    if (refresh_token.expired || refresh_token.invalid) {
      refresh_id = v4();
      user.refresh_token = signRefreshToken(refresh_id, user);
      await datasource.getRepository(User).save(user);
    } else {
      refresh_id = refresh_token.refresh_id;
    }

    ctx.body = {
      message: `Welcome ${user.username}.`,
      access_token: signAccessToken(refresh_id, user),
    };
  }

  static async findAll(ctx: Context) {
    let user: User[] = await datasource.getRepository(User).find();
    ctx.assert(user.length > 0, 404, "No user found.");
    ctx.body = user;
  }

  static async findOne(ctx: Context) {
    let user = await datasource
      .getRepository(User)
      .findOneBy({ id: ctx.params.id });
    ctx.assert(user, 404, "User not found.");
    ctx.body = user;
  }

  static async createOne(ctx: Context) {
    ctx.assert(
      !(await datasource.getRepository(User).findOneBy({
        username: ctx.request.body.username,
        email: ctx.request.body.email,
      })),
      409,
      "User already exists."
    );

    const user = new User();
    user.enable = true;
    user.email = ctx.request.body.email;
    user.username = ctx.request.body.username;
    const refresh_id = v4();
    user.id = v4();
    user.refresh_token = signRefreshToken(refresh_id, user);
    user.password = await encrypt(ctx.request.body.password);

    await datasource.getRepository(User).save(user);
    ctx.status = 201;
    ctx.body = {
      message: `${user.username} created.`,
      access_token: signAccessToken(refresh_id, user),
      ...user,
    };
  }

  static async findOneAndUpdate(ctx: Context) {
    let user = await datasource
      .getRepository(User)
      .findOneBy({ id: ctx.params.id });
    ctx.assert(user, 404, "User not found.");

    if (ctx.request.body.username) {
      ctx.assert(
        ctx.request.body.username !== user.username,
        400,
        "Cannot change equal usernames."
      );
      user.username = ctx.request.body.username;
    }

    if (ctx.request.body.email) {
      ctx.assert(
        ctx.request.body.email !== user.email,
        400,
        "Cannot change equal emails."
      );
      user.email = ctx.request.body.email;
    }

    if (ctx.request.body.password) {
      ctx.assert(
        !(await compare(ctx.request.body.password, user.password)),
        400,
        "Cannot change equal passwords."
      );
      user.password = await encrypt(ctx.request.body.password);
    }

    const refresh_id = v4();
    user.refresh_token = signRefreshToken(refresh_id, user);

    await datasource.getRepository(User).save(user);
    ctx.status = 201;
    ctx.body = {
      message: `${user.username} updated.`,
      access_token: signAccessToken(refresh_id, user),
      ...user,
    };
  }

  static async findOneAndDelete(ctx: Context) {
    const user = await datasource
      .getRepository(User)
      .findOneBy({ id: ctx.params.id });
    ctx.assert(user, 404, "User not found.");
    await datasource.getRepository(User).delete(user.id);

    ctx.body = {
      message: `${user.username} deleted.`,
    };
  }
}
