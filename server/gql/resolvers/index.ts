import catalogueResolvers from "./catalogue";
import labelResolvers from "./label";
import listingResolvers from "./listing";
import utilResolvers from "./util";
import { GraphQLUpload } from "graphql-upload";
import linkResolvers from "./link";
import listingLabelResolvers from "./listingLabel";

const resolversAggregate = [
  catalogueResolvers,
  labelResolvers,
  listingResolvers,
  linkResolvers,
  listingLabelResolvers,
  utilResolvers,
];
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
