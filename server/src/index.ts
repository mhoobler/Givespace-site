import dotenv from "dotenv";
dotenv.config();
import { app, httpServer } from "./app";
import apolloServer from "./graphql";
import { Request, Response } from "express";
import db from "../db";

const startServers = async () => {
  app.get("/test", async (req: Request, res: Response) => {
    try {
      const { rows } = await db.query("SELECT * FROM catalogues");
      console.log(rows);
      res.send({ message: rows });
    } catch (err) {
      console.log(err);
    }
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({ app });

  httpServer.listen(process.env.PORT, () =>
    console.log(
      `🚀 Server ready at http://localhost:${process.env.PORT}${apolloServer.graphqlPath}`
    )
  );
};

startServers();
