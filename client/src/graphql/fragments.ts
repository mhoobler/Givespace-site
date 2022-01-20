import { gql } from "@apollo/client";

export const CATALOGUE_LIST_ITEM_FIELDS = gql`
  fragment CatalogueListItemFields on Catalogue {
    id
    edit_id
    user_id
    status
    title
    description
    created
    updated
  }
`;

export const ALL_CATALOGUE_FIELDS = gql`
  fragment AllCatalogueFields on Catalogue {
    id
    user_id
    title
    description
    created
    updated
    views
    header_image_url
    header_color
    edit_id
    author
    profile_picture_url
    event_date
    location
  }
`;
