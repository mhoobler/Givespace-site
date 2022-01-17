import { IExecutableSchemaDefinition } from "@graphql-tools/schema";
export type Resolver = IExecutableSchemaDefinition<any>;

export type Context = {
  authToken?: string | null;
};

export type Catalogues = {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  created: string;
  updated: string;
};

export interface CatalogueListItem {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  created: string;
  updated: string;
}

export interface Catalogue extends CatalogueListItem {
  views: number;
  header_image_url: string;
  head_color: string;
  edit_id: string;
  author: string;
  profile_picture_url: string;
  event_date: string;
}
