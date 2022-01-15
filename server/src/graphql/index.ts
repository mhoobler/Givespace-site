import { ApolloServer } from "apollo-server-express";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { SubscriptionServer } from "subscriptions-transport-ws";
import { execute, subscribe } from "graphql";
import { httpServer } from "../app";
import schema from "./schema";
import { PubSub } from "graphql-subscriptions";
import fetch from "node-fetch";

export const pubsub = new PubSub();

const subscriptionServer = SubscriptionServer.create(
  {
    schema,
    execute,
    subscribe,
    async onConnect(connectionParams) {
      if (connectionParams.user) {
        const currentUser = await fetch(
          `http://localhost:3000/users?name=${connectionParams.user}`
        );
        const parsedUser = await currentUser.json();
        console.log(parsedUser);
        if (parsedUser.length) {
          return { currentUser: parsedUser[0] };
        }
      }
    },
    // onDisconnect: () => {},
  },
  {
    server: httpServer,
    path: "/graphql",
  }
);

const apolloServer = new ApolloServer({
  schema,
  context: ({ req }) => ({
    authToken: req.headers.authorization,
  }),
  plugins: [
    ApolloServerPluginLandingPageGraphQLPlayground(),
    {
      async serverWillStart() {
        return {
          async drainServer() {
            subscriptionServer.close();
          },
        };
      },
    },
  ],
});

export default apolloServer;
