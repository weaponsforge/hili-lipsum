console.log("Node version:", process.version);
console.log("Platform:", process.platform);
console.log("Arch:", process.arch);
console.log("V8 version:", process.versions.v8);
console.log("npm version:", require("child_process")
  .execSync("npm -v")
  .toString()
  .trim());