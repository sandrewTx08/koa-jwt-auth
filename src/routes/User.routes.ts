import Router from "koa-router";
import { UserController } from "../controller/User.controller";
const router = new Router();

router
  .prefix("/v1")
  .post(["/signin", "/login"], UserController.authenticatePassword)
  .post(["/signup", "/register", "/user"], UserController.createOne)
  .get("/user", UserController.findAll)
  .get("/user/:id", UserController.findOne)
  .patch("/user/:id", UserController.findOneAndUpdate)
  .delete("/user/:id", UserController.findOneAndDelete);

router.routes();
router.allowedMethods();

export const UserRoute = router;
