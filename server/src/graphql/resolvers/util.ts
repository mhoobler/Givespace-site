import { withFilter } from "graphql-subscriptions";
import { pubsub } from "../index";
import fetch from "node-fetch";
import jwt from "jsonwebtoken";
import { Resolver, Context } from "../../types";

const userResolvers = {
  Query: {
    getJwt: (_: undefined, args: undefined, context: Context): String => {
      console.log("context", context);
      if (context.authToken) {
        console.log("context.authToken", context.authToken);
        return context.authToken;
      } else {
        const newAuthToken = "bearer " + jwt.sign({}, process.env.JWT_SECRET);
        console.log("newAuthToken", newAuthToken);
        return newAuthToken;
      }
    },
  },
  Mutation: {},
  Subscription: {},
};

export default userResolvers;
