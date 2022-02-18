type GenericEdit = (value: string, keyProp: string) => void;
type GenericFileEdit = (value: File | undefined, keyProp: string) => void;

type Context = {
  authorization?: string | null;
  authToken?: string | null;
};

enum Status {
  public = "public",
  private = "private",
  sharable = "sharable",
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
}

interface CatalogueType extends CatalogueStub {
  views: number;
  header_image_url: string | null;
  header_color: string;
  author: string | null;
  profile_picture_url: string | null;
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
  created: string;
  updated: string;
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

type MarkedForDeletion = {
  id: string;
  text: string;
  timeout: any;
  data: any;
  fragment: DocumentNode;
  fragmentName: string;
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
