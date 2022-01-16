import { IExecutableSchemaDefinition } from "@graphql-tools/schema";
export type Resolver = IExecutableSchemaDefinition<any>;

export type Context = {
  authToken?: string | null;
};

export type Catalogues = {
  id: string;
  user_id: string;
  title: string | null;
  description: string | null;
};
