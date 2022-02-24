import { ApolloServer } from "apollo-server-express";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { SubscriptionServer } from "subscriptions-transport-ws";
import { execute, subscribe } from "graphql";
import { httpServer } from "../app";
import schema from "./schema";
import { PubSub } from "graphql-subscriptions";
import db from "../db";
// import { Metric, MetricType } from "../types";
// TODO: remove the types below, for some reason I cannot import
enum MetricType {
  ROUTING = "routing",
  API = "api",
  CLICK = "click",
}
type Metric = {
  type: MetricType;
  user_id?: string;
  operationName?: string;
  operationType?: string;
  operationVariables?: string;
};

type Context = any;

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
  context: ({ req }): Context => {
    // console.log("!req", req);
    let metric: Metric = {
      type: MetricType.API,
    };
    if (req.headers.authorization) {
      metric.user_id = req.headers.authorization;
    }
    if (
      req.body &&
      req.body.query &&
      req.body.variables &&
      req.body.operationName
    ) {
      metric.operationName = req.body.operationName;
      let processedQuery = req.body.query.split("\n");
      processedQuery = processedQuery.filter((line) => {
        if (
          line.slice(0, 8) === "fragment" ||
          [" ", "{", "}"].includes(line.slice(0, 1)) ||
          line.slice(0, 2) === "\n" ||
          line.length === 0
        ) {
          return false;
        } else {
          return true;
        }
      });
      if (processedQuery.length > 0) {
        metric.operationType = processedQuery[0];
      } else {
        metric.operationType = req.body.query
          .split("\n")
          .slice(0, 20)
          .join("\n");
      }
      metric.operationVariables = JSON.stringify(req.body.variables);
    }

    if (!["GetMetrics", "IntrospectionQuery"].includes(metric.operationName)) {
      console.log("!metrics", metric);
      db.query(
        "INSERT INTO metrics (type, user_id, operation_name, operation_type, operation_variables) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        [
          metric.type,
          metric.user_id,
          metric.operationName,
          metric.operationType,
          metric.operationVariables,
        ]
      ).then((res) => {
        console.log("!res", res.rows);
      });
    }

    return {
      authorization: req.headers.authorization,
    };
  },
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
