import { withFilter } from "graphql-subscriptions";
import { pubsub } from "../index";
import fetch from "node-fetch";
import { verifyToken } from "../../utils/functions";
import { Context } from "../../types";

const userResolvers = {
  Query: {
    users: async () => {
      const response = await fetch("http://localhost:3000/users");
      const users = await response.json();
      return users;
    },
  },
  Mutation: {
    createUser: async (_, args, context: Context) => {
      console.log("context", context);
      verifyToken(context.authToken);
      const response = await fetch("http://localhost:3000/users", {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(args),
      });
      const user = await response.json();
      pubsub.publish("USER_CREATED", { liveUsers: user });
      return user;
    },
  },
  Subscription: {
    liveUsers: {
      subscribe: withFilter(
        () => pubsub.asyncIterator("USER_CREATED"),
        (payload, variables) => {
          return payload.liveUsers.name.includes(variables.mustInclude);
        }
      ),
    },
  },
};

export default userResolvers;
