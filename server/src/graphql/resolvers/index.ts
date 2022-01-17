import userResolvers from "./user";
import catalogueResolvers from "./catalogue";
import utilResolvers from "./util";

// combine all the resolvers
const resolversAggregate = [userResolvers, utilResolvers];
let resolvers = {
  Query: {},
  Mutation: {},
  Subscription: {},
};

resolversAggregate.forEach((resolver) => {
  resolvers = {
    Query: {
      ...resolvers.Query,
      ...resolver.Query,
      ...catalogueResolvers.Query,
    },
    Mutation: {
      ...resolvers.Mutation,
      ...resolver.Mutation,
      ...catalogueResolvers.Mutation,
    },
    Subscription: {
      ...resolvers.Subscription,
      ...resolver.Subscription,
      ...catalogueResolvers.Subscription,
    },
  };
});

export default resolvers;
