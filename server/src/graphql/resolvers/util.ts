import { withFilter } from "graphql-subscriptions";
import { pubsub } from "../index";
import fetch from "node-fetch";
import jwt from "jsonwebtoken";
import { Resolver, Context } from "../../types";

const userResolvers = {
  Query: {
    getJwt: (_: undefined, args: undefined, context: Context): String => {
      if (context.authToken) {
        return context.authToken;
      } else {
        const newAuthToken = "bearer " + jwt.sign({}, process.env.JWT_SECRET);
        return newAuthToken;
      }
    },
  },
  Mutation: {},
  Subscription: {},
};

export default userResolvers;
