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

export const LABEL_FIELDS = gql`
  fragment AllLabelFields on Label {
    id
    catalogue_id
    name
    link_url
    ordering
    is_private
    created
    updated
  }
`;

export const LISTING_FIELDS = gql`
  fragment AllListingFields on Listing {
    id
    catalogue_id
    name
    link_url
    image_url
    description
    ordering
    show_price
    price
    created
    updated
  }
`;

export const ALL_CATALOGUE_FIELDS = gql`
  ${LISTING_FIELDS}
  ${LABEL_FIELDS}
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
      ...AllLabelFields
    }
    listings {
      ...AllListingFields
    }
  }
`;
