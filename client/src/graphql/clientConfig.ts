import { ApolloClient, InMemoryCache, HttpLink, split } from "@apollo/client";
import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from "@apollo/client/utilities";
import { v4 as uuidv4 } from "uuid";

const authorization = localStorage.getItem("authorization");
if (!authorization) {
  const newUuid = uuidv4();
  console.log("newUuid", newUuid);
  localStorage.setItem("authorization", newUuid);
}

export const httpLink = new HttpLink({
  uri: "http://localhost:4000/graphql",
  headers: {
    authorization: localStorage.getItem("authorization")
      ? localStorage.getItem("authorization")
      : "",
  },
});

const wsLink = new WebSocketLink({
  uri: "ws://localhost:4000/graphql",
  options: {
    reconnect: true,
    connectionParams: {
      authToken: localStorage.getItem("authorization")
        ? localStorage.getItem("authorization")
        : "",
    },
  },
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLink
);

export const cache = new InMemoryCache();

export const client = new ApolloClient({
  link: splitLink,
  cache,
});

export default client;
