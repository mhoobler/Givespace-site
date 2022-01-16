interface CatalogueListItem {
  id: string;
  user_id: string;
  title: string;
  created: string;
  updated: string;
}

interface Catalogue extends CatalogueListItem {
  views: number;
  header_image_url: string;
  head_color: string;
  edit_id: string;
  author: string;
  profile_picture_url: string;
  event_data: string;
}

type CatalogueList = CatalogueListItem[];
