import { gql } from "@apollo/client";

export const CATALOGUE_TRUNCATED = gql`
  fragment CatalogueTruncatedFields on Catalogue {
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
    author
    header_image_url
    profile_picture_url
    header_color
    listings {
      id
      image_url
    }
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

export const LINK_FIELDS = gql`
  fragment AllLinkFields on Link {
    id
    listing_id
    url
    title
    created
    updated
  }
`;

export const LISTING_LABEL_FIELDS = gql`
  ${LABEL_FIELDS}
  fragment AllListingLabelFields on ListingLabel {
    id
    listing_id
    label {
      ...AllLabelFields
    }
  }
`;

export const LISTING_FIELDS = gql`
  ${LISTING_LABEL_FIELDS}
  ${LINK_FIELDS}
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
    labels {
      ...AllListingLabelFields
    }
    links {
      ...AllLinkFields
    }
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
    views
    header_image_url
    header_color
    author
    profile_picture_url
    event_date
    location
    created
    updated
    labels {
      ...AllLabelFields
    }
    listings {
      ...AllListingFields
    }
  }
`;

export const ALL_METRIC_FIELDS = gql`
  fragment AllMetricFields on Metric {
    id
    type
    user_id
    operation_name
    operation_type
    operation_variables
    navigate_to
    click_on
    created
  }
`;

export const ALL_FEEDBACK_FIELDS = gql`
  fragment AllFeedbackFields on Feedback {
    id
    user_id
    message
    email
    created
  }
`;
