import dotenv from "dotenv";
dotenv.config();
import { app, httpServer } from "./app";
import apolloServer from "./gql";
import { Request, Response } from "express";
import db from "./db";
import { graphqlUploadExpress } from "graphql-upload";

const startServers = async () => {
  app.get("/test", async (req: Request, res: Response) => {
    try {
      const { rows } = await db.query("SELECT * FROM catalogues");
      res.send({ message: rows });
    } catch (err) {
      console.log(err);
    }
  });

  await apolloServer.start();
  app.use(graphqlUploadExpress());
  apolloServer.applyMiddleware({ app });

  httpServer.listen(process.env.PORT, () =>
    console.log(
      `🚀 Server ready at http://localhost:${process.env.PORT}${apolloServer.graphqlPath}`
    )
  );
};

startServers();
