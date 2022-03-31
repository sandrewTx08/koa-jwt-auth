const { request } = require("./index");

describe("user controller", () => {
  before(() => {
    createOneCredentials = {
      username: "testUsername",
      password: "testPassword",
      email: "testEmail@email.com",
    };
  });

  before(() => {
    updateOneCredentials = {
      username: "testUsernameUpdated",
      password: "testPasswordUpdated",
      email: "testEmailUpdated@email.com",
    };
  });

  describe("User controller", () => {
    it("createOne", () => {
      return request
        .post("/v1/user")
        .send({
          email: createOneCredentials.email,
          username: createOneCredentials.username,
          password: createOneCredentials.password,
        })
        .set("Content-Type", "application/json")
        .set("Accept", "application/json")
        .expect(201)
        .then((res) => {
          createOne = res.body;
        });
    });

    it("createOne duplicate", () => {
      return request
        .post("/v1/user")
        .send({
          email: createOneCredentials.email,
          username: createOneCredentials.username,
          password: createOneCredentials.password,
        })
        .set("Content-Type", "application/json")
        .set("Accept", "application/json")
        .expect(409);
    });

    it("findOne after create", () => {
      return request.get(`/v1/user/${createOne.id}`).expect(200);
    });

    it("findAll", () => {
      return request.get("/v1/user").expect(200);
    });

    it("findOneAndUpdate", () => {
      return request
        .patch(`/v1/user/${createOne.id}`)
        .send({
          email: updateOneCredentials.email,
          username: updateOneCredentials.username,
          password: updateOneCredentials.password,
        })
        .set("Content-Type", "application/json")
        .set("Accept", "application/json")
        .expect(201)
        .then((res) => {
          updatedOne = res.body;
        });
    });

    it("findOneAndUpdate equal username", () => {
      return request
        .patch(`/v1/user/${updatedOne.id}`)
        .send({
          username: updateOneCredentials.username,
        })
        .set("Content-Type", "application/json")
        .set("Accept", "application/json")
        .expect(400);
    });

    it("findOneAndUpdate equal email", () => {
      return request
        .patch(`/v1/user/${updatedOne.id}`)
        .send({
          email: updateOneCredentials.email,
        })
        .set("Content-Type", "application/json")
        .set("Accept", "application/json")
        .expect(400);
    });

    it("findOneAndUpdate equal password", () => {
      return request
        .patch(`/v1/user/${updatedOne.id}`)
        .send({
          password: updateOneCredentials.password,
        })
        .set("Content-Type", "application/json")
        .set("Accept", "application/json")
        .expect(400);
    });

    it("findOne after update", () => {
      return request.get(`/v1/user/${updatedOne.id}`).expect(200);
    });

    it("findOneAndDelete", () => {
      return request.delete(`/v1/user/${updatedOne.id}`).expect(200);
    });

    it("findOne after delete", () => {
      return request.get(`/v1/user/${createOne.id}`).expect(404);
    });

    it("findOne after delete", () => {
      return request.get(`/v1/user/${updatedOne.id}`).expect(404);
    });
  });
});
