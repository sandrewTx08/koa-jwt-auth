const { UserRoute } = require("../build/routes/User.route");
const Koa = require("koa");
const supertest = require("supertest");
const { datasource } = require("../build/datasource");
const bodyParser = require("koa-bodyparser");

describe("user controller", () => {
  before(() => {
    return datasource.initialize();
  });

  before(() => {
    app = new Koa();
    app.use(bodyParser());
    app.use(UserRoute.middleware());
    app = app.listen(process.env.PORT || 8081);
  });

  describe("User controller", () => {
    it("createOne", () => {
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

    it("findAll", () => {
      return supertest(app).get("/v1/user").expect(200);
    });

    it("findOneAndUpdate", () => {
      return supertest(app)
        .patch(`/v1/user/${createOne.id}`)
        .send({
          username: "testUsernameUpdated",
          password: "testPasswordUpdated",
          email: "testEmailUpdated@email.com",
        })
        .set("Content-Type", "application/json")
        .set("Accept", "application/json")
        .expect(201)
        .then((res) => {
          updatedOne = res.body;
        });
    });

    it("findOneAndDelete", () => {
      return supertest(app).delete(`/v1/user/${updatedOne.id}`).expect(200);
    });
  });

  after(() => {
    app.close();
  });
});
