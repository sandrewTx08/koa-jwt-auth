import { Context } from "koa";
import Router from "koa-router";
const router = new Router();

router.get("/", (ctx: Context) => {
  ctx.body = "<h1>Hello World!</h1>";
});

router.routes();
router.allowedMethods();

export const HelloWorldRoute = router;
