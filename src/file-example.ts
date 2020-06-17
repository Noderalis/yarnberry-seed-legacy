import fs from "fs";

const pkg: string = fs.readFileSync(`${__dirname}/../package.json`, {
  encoding: "utf8",
});
const pkgObj = JSON.parse(pkg);

console.log(`Hello, ${pkgObj.name}!`);
