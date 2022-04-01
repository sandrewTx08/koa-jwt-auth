const app = require("../build/app");
module.exports.app = app;
module.exports.request = require("supertest")(app);
