import userResolvers from "./user";

const resolvers = Object.assign(
  {
    Query: {},
    Mutation: {},
    Subscription: {},
  },
  userResolvers
);

export default resolvers;
