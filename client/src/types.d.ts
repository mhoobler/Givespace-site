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
  title: string;
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
