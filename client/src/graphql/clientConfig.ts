import { ApolloClient, InMemoryCache, HttpLink, split } from "@apollo/client";
import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from "@apollo/client/utilities";
import { v4 as uuidv4 } from "uuid";
import { createUploadLink } from "apollo-upload-client";

const authorization = localStorage.getItem("authorization");
if (!authorization) {
  // const newUuid = uuidv4();
  const newUuid = "6a3a2967-0258-4caf-8fef-f844c060b2f2";
  console.log("newUuid", newUuid);
  localStorage.setItem("authorization", newUuid);
}

export const httpLink = createUploadLink({
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
  // @ts-ignore
  httpLink
);

export const cache = new InMemoryCache();

export const client = new ApolloClient({
  link: splitLink,
  cache,
});

export default client;
