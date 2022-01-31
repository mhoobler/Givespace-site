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
    edit_id
    user_id
    status
    title
    description
    created
    updated
    views
    header_image_url
    header_color
    author
    profile_picture_url
    event_date
    location
    labels {
      id
      name
      ordering
    }
  }
`;

export const CATALOGUE_FRAGMENT = gql`
  fragment Catalogue on Catalogue {
    id
    edit_id
    user_id
    status
    title
    description
    created
    updated
    views
    header_image_url
    header_color
    author
    profile_picture_url
    event_date
    location
    labels {
      id
      name
      ordering
    }
  }
`;

export const LABEL_FIELDS = gql`
  fragment AllLabelFields on Label {
    id
    catalogue_id
    name
    link_url
    is_private
    ordering
    created
    updated
  }
`;
