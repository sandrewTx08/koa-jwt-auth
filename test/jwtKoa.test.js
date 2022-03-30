const { UserRoute } = require("../build/routes/User.route");
const { HelloWorldRoute } = require("../build/routes/helloWorld");
const { jwtKoa } = require("../build/middleware/jwtKoa");
const Koa = require("koa");
const supertest = require("supertest");
const { datasource } = require("../build/datasource");
const bodyParser = require("koa-bodyparser");
const assert = require("assert");
const { verifyAccessToken, verifyRefreshToken } = require("../build/token");

describe("token request", () => {
  before(() => {
    if (!datasource.isInitialized) return datasource.initialize();
  });

  before(() => {
    app = new Koa();
    app
      .use(bodyParser())
      .use(UserRoute.middleware())
      .use(jwtKoa())
      .use(HelloWorldRoute.middleware());
    app = app.listen(process.env.PORT || 8081);
  });

  before(() => {
    userCredentials = {
      username: "testJwtKoaUsername",
      password: "testJwtKoaPassword",
      email: "testJwtKoaEmail@email.com",
    };
  });

  describe("first tokens", () => {
    it("creating a user", () => {
      return supertest(app)
        .post("/v1/user")
        .send(userCredentials)
        .set("Content-Type", "application/json")
        .set("Accept", "application/json")
        .expect(201)
        .then((res) => {
          createdUser = res.body;
          assert(!verifyAccessToken(createdUser.access_token).invalid);
          assert(!verifyRefreshToken(createdUser).invalid);
        });
    });

    it("login and return access token", () => {
      return supertest(app)
        .post("/v1/login")
        .send({
          username: userCredentials.username,
          password: userCredentials.password,
        })
        .expect(200)
        .then((res) => {
          assert(!verifyAccessToken(res.text).invalid);
        });
    });
  });

  after(() => {
    return supertest(app).delete(`/v1/user/${createdUser.id}`).expect(200);
  });

  after(() => {
    app.close();
  });
});
