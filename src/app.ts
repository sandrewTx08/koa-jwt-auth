import Koa, { Context } from "koa";
import Router from "koa-router";
import { UserController } from "./controller/User.controller";
import bodyParser from "koa-bodyparser";
import jwt from "./middleware/token";
import { datasource } from "./datasource";
const app = new Koa();
const user = new Router();
const general = new Router();

datasource.initialize().then(() => {
  user
    .prefix("/v1")
    .post(["/signin", "/login"], UserController.authenticatePassword)
    .post(["/signup", "/register", "/user"], UserController.createOne)
    .get("/user", UserController.findAll)
    .get("/user/:id", UserController.findById)
    .patch("/user/:id", UserController.findByIAndUpdate)
    .delete("/user/:id", UserController.findByIdAndDelete);

  general.get("/", (ctx: Context) => {
    ctx.body = "Hello World!";
  });

  app
    .use(bodyParser())
    .use(user.routes())
    .use(user.allowedMethods())
    .use(jwt)
    .use(general.routes())
    .use(general.allowedMethods())
    .listen(process.env.PORT || 8080);
});
