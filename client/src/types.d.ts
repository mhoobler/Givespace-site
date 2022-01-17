interface CatalogueListItem {
  id: string;
  user_id: string;
  title: string;
  created: string | null;
  updated: string | null;
}

interface Catalogue extends CatalogueListItem {
  views: number | null;
  header_image_url: string | null;
  head_color: string | null;
  edit_id: string | null;
  author: string | null;
  profile_picture_url: string | null;
  event_date: string | null;
}

type CatalogueList = CatalogueListItem[];
