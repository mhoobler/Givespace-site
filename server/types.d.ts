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

export interface ListingTrunctated {
  id: string;
  image_url: string;
}

export interface CatalogueTruncated {
  id: string;
  user_id: string;
  edit_id: string;
  status: Status;
  title: string;
  description: string | null;
  created: Date;
  updated: Date;
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
  listings: ListingTrunctated[] | null;
}

export interface Catalogue extends CatalogueListItem {
  views: number;
  header_image_url: string | null;
  header_color: string;
  labels: Label[] | null;
  listings: Listing[] | null;
  author: string | null;
  profile_picture_url: string | null;
  event_date: Date | null;
  location: string | null;
}

export type Label = {
  id: string;
  catalogue_id: string;
  name: string;
  link_url: string | null;
  ordering: number;
  is_private: boolean;
  created: Date;
  updated: Date;
};

export type Listing = {
  id: string;
  catalogue_id: string;
  name: string | null;
  link_url: string | null;
  image_url: string | null;
  description: string | null;
  ordering: number;
  show_price: Boolean;
  price: number | null;
  links: Link[] | null;
  labels: ListingLabel[] | null;
  created: Date;
  updated: Date;
};

export type Link = {
  id: string;
  listing_id: string;
  url: string;
  title: string | null;
  created: Date;
  updated: Date;
};

export type BasicListingLabel = {
  id: string;
  listing_id: string;
  label_id: string;
};

export type ListingLabel = {
  id: string;
  listing_id: string;
  label: Label;
};

export enum SubscriptionLabels {
  CATALOGUE_EDITED = "CATALOGUE_EDITED",
}

export type ScrapedFeatures = {
  image_url: string;
  item_url: string;
  description: string;
  name: string;
  price: number;
};

export type ViewProps = {
  title: string;
  description: string;
  image_url: string;
  color: string;
  price?: string;
  items_count?: string;
  date?: string;
};

export enum MetricType {
  ROUTING = "routing",
  API = "api",
  CLICK = "click",
}
export type Metric = {
  type: MetricType;
  user_id?: string;
  operation_name?: string;
  operation_type?: string;
  operation_variables?: string;
  navigate_to?: string;
  click_on?: string;
};
