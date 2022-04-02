import Koa from "koa";
import bodyParser from "koa-bodyparser";
import swaggerJsDoc from "swagger-jsdoc";
import { koaSwagger } from "koa2-swagger-ui";
import { jwtKoa } from "./middleware/jwtKoa";
import { datasource } from "./datasource";
import { UserRoute } from "./routes/User.routes";
import { HelloWorldRoute } from "./routes/HelloWorld";
datasource.initialize();
const app = new Koa();

app
  .use(
    koaSwagger({
      routePrefix: "/v1",
      swaggerOptions: {
        spec: {
          ...swaggerJsDoc({
            definition: {
              securityDefinitions: {
                token: {
                  type: "apiKey",
                  name: "Authorization",
                  in: "header",
                },
              },
              openapi: "3.0.1",
              info: {
                title: "koa-jwt-auth",
                contact: { url: "https://github.com/sandrewTx08/koa-jwt-auth" },
                version: "1.0.0",
                description: "API.",
              },
              basePath: "/v1",
            },
            apis: [`${__dirname}/controller/*.ts`, `${__dirname}/routes/*.ts`],
          }),
        },
      },
    })
  )
  .use(bodyParser())
  .use(UserRoute.middleware())
  .use(jwtKoa())
  .use(HelloWorldRoute.middleware());

module.exports = app.listen(process.env.PORT || 8080);
