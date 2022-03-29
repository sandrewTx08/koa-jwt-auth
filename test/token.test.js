const { UserRoute } = require("../build/routes/User.route");
const { HelloWorldRoute } = require("../build/routes/helloWorld");
const { jwtKoa } = require("../build/middleware/jwtKoa");
const Koa = require("koa");
const supertest = require("supertest");
const { datasource } = require("../build/datasource");
const bodyParser = require("koa-bodyparser");
const {
  signAccessToken,
  verifyAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} = require("../build/token");
const { v4 } = require("uuid");
const assert = require("assert");

describe("token", () => {
  before(() => {
    if (!datasource.isInitialized) return datasource.initialize();
  });

  before(() => {
    process.env.JWT_REFRESH_TOKEN_EXP = "1 week";
    process.env.JWT_REFRESH_TOKEN = "2000";
    process.env.JWT_ACCESS_TOKEN_EXP = "8 hour";
    process.env.JWT_ACCESS_TOKEN = "1000";
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
    return supertest(app)
      .post("/v1/user")
      .send({
        username: "testUsername",
        password: "testPassword",
        email: "testEmail@email.com",
      })
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .expect(201)
      .then((res) => {
        createOne = res.body;
      });
  });

  before(() => {
    refresh_id = v4();
  });

  describe("token format", () => {
    describe("access token", () => {
      it("sign", () => {
        access_token = signAccessToken(refresh_id, createOne);
      });

      describe("verify", () => {
        describe("valid token", () => {
          it("invalid", () => {
            assert(verifyAccessToken("not valid token", createOne).invalid);
          });

          it("valid", () => {
            assert(!verifyAccessToken(access_token, createOne).invalid);
          });
        });

        describe("expired", () => {});
      });
    });

    describe("refresh token", () => {
      it("sign", () => {
        refresh_token = signRefreshToken(refresh_id, createOne);
      });

      describe("verify", () => {
        describe("valid token", () => {
          it("invalid", () => {
            assert(verifyRefreshToken("not valid token", createOne).invalid);
          });

          it("valid", () => {
            assert(!verifyRefreshToken(createOne).invalid);
          });
        });
      });
    });
  });

  describe("token authentication", () => {
    it("login and return token", () => {
      return supertest(app)
        .post("/v1/login")
        .send({
          username: "testUsername",
          password: "testPassword",
        })
        .expect(200)
        .then((res) => {
          loginToken = res.text;
        });
    });
  });

  after(() => {
    return supertest(app).delete(`/v1/user/${createOne.id}`).expect(200);
  });

  after(() => {
    app.close();
  });
});
