import Koa from "koa";
import bodyParser from "koa-bodyparser";
import { jwtKoa } from "./middleware/jwtKoa";
import { datasource } from "./datasource";
import { UserRoute } from "./routes/User.routes";
import { HelloWorldRoute } from "./routes/HelloWorld";
datasource.initialize();
const app = new Koa();

app
  .use(bodyParser())
  .use(UserRoute.middleware())
  .use(jwtKoa())
  .use(HelloWorldRoute.middleware());

module.exports = app.listen(process.env.PORT || 8080);
