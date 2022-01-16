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
      // do when subscription is triggered
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
