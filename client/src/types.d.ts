export type Context = {
  authorization?: string | null;
  authToken?: string | null;
};
export interface CatalogueListItem {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  created: Date;
  updated: Date;
}

export interface Catalogue extends CatalogueListItem {
  views: number;
  header_image_url: string | null;
  head_color: string;
  edit_id: string;
  author: string | null;
  profile_picture_url: string | null;
  event_date: Date | null;
}
