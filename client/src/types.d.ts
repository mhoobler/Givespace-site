type Context = {
  authorization?: string | null;
  authToken?: string | null;
};

interface CatalogueStub {
  id: string;
  edit_id: string;
  user_id: string;
  title: string;
  description: string | null;
  created: Date;
  updated: Date;
}

interface CatalogueType extends CatalogueStub {
  views: number;
  header_image_url: string | null;
  header_color: string;
  edit_id: string;
  author: string | null;
  profile_picture_url: string | null;
  event_date: Date | null;
}
