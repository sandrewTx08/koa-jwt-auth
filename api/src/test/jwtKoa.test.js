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
  describe("token authorization", () => {
    describe("token from user creation", () => {
      it("create user", () => {
        return request
          .post("/v1/user")
          .send(userCredentials)
          .set("Content-Type", "application/json")
          .set("Accept", "application/json")
          .expect(201)
          .then((res) => {
            createdUser = res.body;
            assert(verifyAccessToken(createdUser.access_token));
            assert(verifyRefreshToken(createdUser));
          });
      });

      it("send access token", () => {
        return request
          .get("/")
          .set("Authorization", `Bearer ${createdUser.access_token}`)
          .expect(200)
          .then((res) => {
            assert(res.text === "<h1>Hello World!</h1>");
          });
      });
    });

    describe("token from login", () => {
      let loginToken;

      it("login and return access token", () => {
        return request
          .post("/v1/login")
          .send({
            username: userCredentials.username,
            password: userCredentials.password,
          })
          .expect(200)
          .then((res) => {
            loginToken = res.text;
            assert(verifyAccessToken(res.text));
          });
      });

      it("send access token", () => {
        return request
          .get("/")
          .set("Authorization", `Bearer ${loginToken}`)
          .expect(200)
          .then((res) => {
            assert(res.text === "<h1>Hello World!</h1>");
          });
      });
    });
  });

  after(() => {
    return request.delete(`/v1/user/${createdUser.id}`).expect(200);
  });
});
