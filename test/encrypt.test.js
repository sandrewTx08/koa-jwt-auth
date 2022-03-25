const bcrypt = require("bcrypt");
const assert = require("assert");

describe("test encryption", () => {
  before(() => {
    notEncrypted = "sensive information";
  });

  it("hash data", () => {
    return bcrypt.hash(notEncrypted, 10).then((encrypted) => {
      isEncrypted = encrypted;
    });
  });

  it("compare hash data", () => {
    return bcrypt.compare(notEncrypted, isEncrypted).then((pass) => {
      assert(pass);
    });
  });
});
