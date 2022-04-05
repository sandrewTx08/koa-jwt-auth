import Koa from "koa";
import bodyParser from "koa-bodyparser";
import yaml from "js-yaml";
import { koaSwagger } from "koa2-swagger-ui";
import { jwtKoa } from "./middleware/jwtKoa";
import { datasource } from "./datasource";
import { UserRoute } from "./routes/User.routes";
import { readFile } from "fs";
import { HelloWorldRoute } from "./routes/HelloWorld";
datasource.initialize();
const app = new Koa();

readFile("./openapi.yml", (err, data) => {
  const spec = Object(yaml.load(data.toString()));
  app
    .use(
      koaSwagger({
        routePrefix: "/v1",
        swaggerOptions: { spec },
      })
    )
    .use(bodyParser())
    .use(UserRoute.middleware())
    .use(jwtKoa())
    .use(HelloWorldRoute.middleware());
});

module.exports = app.listen(process.env.PORT || 8080);
