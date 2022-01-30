import { IExecutableSchemaDefinition } from "@graphql-tools/schema";
export type Resolver = IExecutableSchemaDefinition<any>;

export type Context = {
  authorization?: string | null;
  authToken?: string | null;
};

export enum Status {
  public = "public",
  private = "private",
  sharable = "sharable",
}

export interface CatalogueListItem {
  id: string;
  user_id: string;
  edit_id: string;
  status: Status;
  title: string;
  description: string | null;
  created: Date;
  updated: Date;
}

export interface Catalogue extends CatalogueListItem {
  views: number;
  header_image_url: string | null;
  head_color: string;
  labels: Label[];
  author: string | null;
  profile_picture_url: string | null;
  event_date: Date | null;
  location: string | null;
}

export type Label = {
  id: string;
  catalogue_id: string;
  name: string;
  link_url: string;
  ordering: number;
  is_private: boolean;
  created: Date;
  updated: Date;
};

export enum SubscriptionLabels {
  CATALOGUE_EDITED = "CATALOGUE_EDITED",
}
