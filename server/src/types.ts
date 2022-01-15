import { IExecutableSchemaDefinition } from "@graphql-tools/schema";
export type Resolver = IExecutableSchemaDefinition<any>;

export type Context = {
  authToken?: string | null;
};
