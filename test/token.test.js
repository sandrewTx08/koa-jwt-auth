const { request } = require("./index");
const {
  signAccessToken,
  verifyAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} = require("../build/token");
const { v4 } = require("uuid");
const assert = require("assert");

describe("token", () => {
  let createOne;
  let userCredentials = {
    username: "testTokenUsername",
    password: "testTokenPassword",
    email: "testTokenEmail@email.com",
  };
  before(() => {
    return request
      .post("/v1/user")
      .send(userCredentials)
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .expect(201)
      .then((res) => {
        createOne = res.body;
      });
  });

  describe("token format", () => {
    let refresh_id = v4();

    describe("access token", () => {
      let access_token;

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
        signRefreshToken(refresh_id, createOne);
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
    return request.delete(`/v1/user/${createOne.id}`).expect(200);
  });
});
