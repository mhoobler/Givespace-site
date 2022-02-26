type GenericEdit = (value: string, keyProp: string) => void;
type GenericFileEdit = (value: File | undefined, keyProp: string) => void;

type Context = {
  authorization?: string | null;
  authToken?: string | null;
};

declare enum Status {
  private = "private",
  public = "public",
  collaborative = "collaborative",
}

interface CatalogueStub {
  id: string;
  edit_id: string;
  user_id: string;
  status: Status;
  title: string | null;
  description: string | null;
  created: string;
  updated: string;
  header_color: string;
  listings: ListingStub[] | null;
  profile_picture_url: string | null;
  header_image_url: string | null;
  author: string | null;
}

type ListingStub = any;

interface CatalogueType extends CatalogueStub {
  views: number;
  event_date: string | null;
  location: string | null;
  // TODO: labels and listings can be null
  labels: Label[] | null;
  listings: Listing[] | null;
}

interface Label {
  id: string;
  catalogue_id: string;
  name: string;
  ordering: number;
  is_private: boolean;
  link_url: string | null;
  created: Date;
  updated: Date;
}

interface Listing {
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
}

interface Link {
  id: string;
  listing_id: string;
  url: string;
  title: string | null;
  created: Date;
  updated: Date;
}

interface BasicListingLabel {
  id: string;
  listing_id: string;
  label_id: string;
}

interface ListingLabel {
  id: string;
  listing_id: string;
  label: Label;
}

interface UseMarkedForDeletion {
  markedForDeletion: MarkedForDeletion[];
  setMarkedForDeletion: (value: MarkedForDeletion[]) => void;
}

interface DependentCacheItems {
  id: string;
  fragment: DocumentNode;
  fragmentName: string;
  data: any;
}

type MarkedForDeletion = {
  id: string;
  text: string;
  timeout: any;
  dependentCacheItems: DocumentNode;
};

type RemoveMFD = {
  id: string;
  isUndo: boolean;
} | null;

interface UseFieldEditing {
  fieldEditing: FieldEditing | null;
  setFieldEditing: (value: FieldEditing | null) => void;
}
interface FieldEditing {
  typename: string;
  id: string;
  key: string;
}

declare enum MetricType {
  ROUTING = "routing",
  API = "api",
  CLICK = "click",
}
interface Metric {
  type: MetricType;
  user_id?: string;
  operation_name?: string;
  operation_type?: string;
  operation_variables?: string;
  navigate_to?: string;
  click_on?: string;
}
