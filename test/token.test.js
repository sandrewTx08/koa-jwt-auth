const { UserRoute } = require("../build/routes/User.routes");
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
    app = new Koa();
    app.use(bodyParser()).use(UserRoute.middleware());
    app = app.listen(process.env.PORT || 8081);
  });

  before(() => {
    userCredentials = {
      username: "testTokenUsername",
      password: "testTokenPassword",
      email: "testTokenEmail@email.com",
    };
  });

  before(() => {
    return supertest(app)
      .post("/v1/user")
      .send(userCredentials)
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
            try {
              assert(verifyAccessToken(access_token, createOne));
            } catch (error) {
              assert(error);
            }
          });

          it("valid", () => {
            assert(verifyAccessToken(access_token, createOne));
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
            try {
              assert(verifyRefreshToken("not valid token", createOne));
            } catch (error) {
              assert(error);
            }
          });

          it("valid", () => {
            assert(verifyRefreshToken(createOne));
          });
        });
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
