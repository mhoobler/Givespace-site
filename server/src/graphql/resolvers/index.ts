import catalogueResolvers from "./catalogue";
import utilResolvers from "./util";

const resolversAggregate = [catalogueResolvers, utilResolvers];
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
    },
    Mutation: {
      ...resolvers.Mutation,
      ...resolver.Mutation,
    },
    Subscription: {
      ...resolvers.Subscription,
      ...resolver.Subscription,
    },
  };
});

export default resolvers;
