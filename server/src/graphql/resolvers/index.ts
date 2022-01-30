import catalogueResolvers from "./catalogue";
import labelResolvers from "./label";
import utilResolvers from "./util";
import { GraphQLUpload } from "graphql-upload";

const resolversAggregate = [catalogueResolvers, labelResolvers, utilResolvers];
let resolvers = {
  Query: {},
  Mutation: {},
  Subscription: {},
};

resolversAggregate.forEach((resolver) => {
  resolvers = {
    // @ts-ignore
    Upload: GraphQLUpload,
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
