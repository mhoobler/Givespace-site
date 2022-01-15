import userResolvers from "./user";
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
    Query: { ...resolvers.Query, ...resolver.Query },
    Mutation: { ...resolvers.Mutation, ...resolver.Mutation },
    Subscription: { ...resolvers.Subscription, ...resolver.Subscription },
  };
});

export default resolvers;
