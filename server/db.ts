import { Client } from "pg";
import fs from "fs";
console.log("starting", process.env.DATABASE_URL);
const db = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

if (process.env.NODE_ENV !== "production") {
  var queries = fs
    .readFileSync("init.sql")
    .toString()
    .replace(/(\r\n|\n|\r)/gm, " ") // remove newlines
    .replace(/\s+/g, " ") // excess white space
    .split(";") // split into all statements
    .map(Function.prototype.call, String.prototype.trim)
    .filter(function (el) {
      return el.length != 0;
    }); // remove any empty ones

  const promises = queries.map((query) => {
    return () =>
      new Promise<void>(async (resolve) => {
        db.query(query, (result) => {
          console.log("Running: ", query);
          console.log("Result: " + result);
          resolve();
        });
      });
  });

  promises.reduce((one, two) => one.then(two), Promise.resolve());
}

db.connect();

export default db;
