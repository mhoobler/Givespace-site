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
export type Metric = {
  type: MetricType;
  user_id?: string;
  operation_name?: string;
  operation_type?: string;
  operation_variables?: string;
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
      metric.operation_name = req.body.operationName;
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
        metric.operation_type = processedQuery[0];
      } else {
        metric.operation_type = req.body.query
          .split("\n")
          .slice(0, 20)
          .join("\n");
      }
      metric.operation_variables = JSON.stringify(req.body.variables);
    }

    if (
      !["GetMetrics", "IntrospectionQuery", "CreateMetric"].includes(
        metric.operation_name
      )
    ) {
      console.log("!metrics", metric);
      db.query(
        "INSERT INTO metrics (type, user_id, operation_name, operation_type, operation_variables) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        [
          metric.type,
          metric.user_id,
          metric.operation_name,
          metric.operation_type,
          metric.operation_variables,
        ]
      );
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
