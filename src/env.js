const path = require("path");

module.exports = {
  devEnv: process.env.NODE_ENV === "development",
  cppDirPath: path.join(__dirname, "cpp"),
};
