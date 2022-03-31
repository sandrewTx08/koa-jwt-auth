const { request } = require("./index");
const assert = require("assert");
const { verifyAccessToken, verifyRefreshToken } = require("../build/token");

describe("token request", () => {
  let userCredentials = {
    username: "testJwtKoaUsername",
    password: "testJwtKoaPassword",
    email: "testJwtKoaEmail@email.com",
  };
  let createdUser;
  describe("first tokens", () => {
    it("creating a user", () => {
      return request
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
      return request
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
    return request.delete(`/v1/user/${createdUser.id}`).expect(200);
  });
});
