import { app, httpServer } from "./app";
import dotenv from "dotenv";
import apolloServer from "./graphql";

dotenv.config();

const startServers = async () => {
  await apolloServer.start();
  apolloServer.applyMiddleware({ app });
  httpServer.listen(process.env.PORT, () =>
    console.log(
      `🚀 Server ready at http://localhost:${process.env.PORT}${apolloServer.graphqlPath}`
    )
  );
};

startServers();
