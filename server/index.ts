import express, { Request, Response } from "express";

const app = express();

app.get("*", (req: Request, res: Response) => {
  res.send({ message: "Hello World" });
});

app.listen(3001, () => {
  console.log("app.listening");
});
