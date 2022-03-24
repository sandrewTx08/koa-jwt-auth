const bcrypt = require("bcrypt");
const assert = require("assert");

describe("test password encription", () => {
  before(() => {
    password = "secretpassword";
  });

  it("hash password", () => {
    return bcrypt.hash(password, 10).then((hash) => {
      hashPassword = hash;
    });
  });

  it("compare hash password", () => {
    return bcrypt.compare(password, hashPassword).then((pass) => {
      assert(pass);
    });
  });
});
