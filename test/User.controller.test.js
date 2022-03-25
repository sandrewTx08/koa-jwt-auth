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

    it("createOne duplicate", () => {
      return supertest(app)
        .post("/v1/user")
        .send({
          username: "testUsername",
          password: "testPassword",
          email: "testEmail@email.com",
        })
        .set("Content-Type", "application/json")
        .set("Accept", "application/json")
        .expect(409);
    });

    it("findOne after create", () => {
      return supertest(app).get(`/v1/user/${createOne.id}`).expect(200);
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

    it("findOneAndUpdate equal username", () => {
      return supertest(app)
        .patch(`/v1/user/${updatedOne.id}`)
        .send({
          username: "testUsernameUpdated",
        })
        .set("Content-Type", "application/json")
        .set("Accept", "application/json")
        .expect(400);
    });

    it("findOneAndUpdate equal email", () => {
      return supertest(app)
        .patch(`/v1/user/${updatedOne.id}`)
        .send({
          email: "testEmailUpdated@email.com",
        })
        .set("Content-Type", "application/json")
        .set("Accept", "application/json")
        .expect(400);
    });

    it("findOneAndUpdate equal password", () => {
      return supertest(app)
        .patch(`/v1/user/${updatedOne.id}`)
        .send({
          password: "testPasswordUpdated",
        })
        .set("Content-Type", "application/json")
        .set("Accept", "application/json")
        .expect(400);
    });

    it("findOne after update", () => {
      return supertest(app).get(`/v1/user/${updatedOne.id}`).expect(200);
    });

    it("findOneAndDelete", () => {
      return supertest(app).delete(`/v1/user/${updatedOne.id}`).expect(200);
    });

    it("findOne after delete", () => {
      return supertest(app).get(`/v1/user/${createOne.id}`).expect(404);
    });

    it("findOne after delete", () => {
      return supertest(app).get(`/v1/user/${updatedOne.id}`).expect(404);
    });
  });

  after(() => {
    app.close();
  });
});
