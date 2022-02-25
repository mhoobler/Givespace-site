import { gql } from "@apollo/client";
import {
  LABEL_FIELDS,
  ALL_CATALOGUE_FIELDS,
  CATALOGUE_TRUNCATED,
  LISTING_FIELDS,
  LISTING_LABEL_FIELDS,
  LINK_FIELDS,
  CATALOGUE_LIST_ITEM_FIELDS,
} from "./fragments";

export const GET_JWT = gql`
  query GetJwt {
    getJwt
  }
`;

export const GET_CATALOGUE = gql`
  ${ALL_CATALOGUE_FIELDS}
  query Catalogues($id: ID, $edit_id: String) {
    catalogues(id: $id, edit_id: $edit_id) {
      ...AllCatalogueFields
    }
  }
`;

export const MY_CATALOGUES = gql`
  ${CATALOGUE_LIST_ITEM_FIELDS}
  query MyCatalogues {
    myCatalogues {
      ...CatalogueListItemFields
    }
  }
`;

export const CREATE_CATALOGUE = gql`
  ${CATALOGUE_TRUNCATED}
  mutation CreateCatalogue {
    createCatalogue {
      ...CatalogueTruncatedFields
    }
  }
`;

export const DELTETE_CATALOGUE = gql`
  ${CATALOGUE_TRUNCATED}
  mutation DeleteCatalogue($id: ID!) {
    deleteCatalogue(id: $id) {
      ...CatalogueTruncatedFields
    }
  }
`;

export const INCREMENT_CATALOGUE_VIEWS = gql`
  ${ALL_CATALOGUE_FIELDS}
  mutation IncrementCatalogueViews($id: ID, $edit_id: String) {
    incrementCatalogueViews(id: $id, edit_id: $edit_id) {
      ...AllCatalogueFields
    }
  }
`;

export const UPDATE_CATALOGUE = gql`
  ${ALL_CATALOGUE_FIELDS}
  mutation EditCatalogue($key: String!, $value: String!, $id: ID!) {
    editCatalogue(key: $key, value: $value, id: $id) {
      ...AllCatalogueFields
    }
  }
`;

// TODO: rethink inputs to (id: ID)
export const LIVE_CATALOGUE = gql`
  ${ALL_CATALOGUE_FIELDS}
  subscription LiveCatalogue($id: ID, $edit_id: String) {
    liveCatalogue(id: $id, edit_id: $edit_id) {
      ...AllCatalogueFields
    }
  }
`;

export const UPDATE_CATALOGUE_FILES = gql`
  ${ALL_CATALOGUE_FIELDS}
  mutation EditCatalogueFile($key: String!, $file: Upload!, $id: ID!) {
    editCatalogueFile(key: $key, id: $id, file: $file) {
      ...AllCatalogueFields
    }
  }
`;

export const CREATE_LABEL = gql`
  ${LABEL_FIELDS}
  mutation CreateLabel($catalogue_id: String!, $name: String!) {
    createLabel(catalogue_id: $catalogue_id, name: $name) {
      ...AllLabelFields
    }
  }
`;

export const DELETE_LABEL = gql`
  ${LABEL_FIELDS}
  mutation DeleteLabel($id: ID!) {
    deleteLabel(id: $id) {
      ...AllLabelFields
    }
  }
`;

export const UPDATE_LABEL_ORDER = gql`
  ${LABEL_FIELDS}
  mutation ReorderLabel($id: ID!, $ordering: Float!) {
    reorderLabel(id: $id, ordering: $ordering) {
      ...AllLabelFields
    }
  }
`;

export const CREATE_LISTING = gql`
  ${LISTING_FIELDS}
  mutation CreateListing($catalogue_id: ID!, $name: String!) {
    createListing(catalogue_id: $catalogue_id, name: $name) {
      ...AllListingFields
    }
  }
`;

export const DELETE_LISTING = gql`
  ${LISTING_FIELDS}
  mutation DeleteListing($id: ID!) {
    deleteListing(id: $id) {
      ...AllListingFields
    }
  }
`;

export const EDIT_LISTING = gql`
  ${LISTING_FIELDS}
  mutation EditListing($key: String!, $value: String!, $id: ID!) {
    editListing(key: $key, value: $value, id: $id) {
      ...AllListingFields
    }
  }
`;

export const EDIT_LISTING_FILE = gql`
  ${LISTING_FIELDS}
  mutation EditListingFile($file: Upload!, $id: ID!) {
    editListingFile(id: $id, file: $file) {
      ...AllListingFields
    }
  }
`;

export const UPDATE_LISTING_ORDER = gql`
  ${LISTING_FIELDS}
  mutation ReorderListing($id: ID!, $ordering: Float!) {
    reorderListing(id: $id, ordering: $ordering) {
      ...AllListingFields
    }
  }
`;

export const ADD_LISTING_LABEL = gql`
  ${LISTING_LABEL_FIELDS}
  mutation CreateListingLabel($listing_id: ID!, $label_id: ID!) {
    createListingLabel(listing_id: $listing_id, label_id: $label_id) {
      ...AllListingLabelFields
    }
  }
`;
export const REMOVE_LISTING_LABEL = gql`
  ${LISTING_LABEL_FIELDS}
  mutation DeleteListingLabel($id: ID!) {
    deleteListingLabel(id: $id) {
      ...AllListingLabelFields
    }
  }
`;

export const ADD_LINK = gql`
  ${LINK_FIELDS}
  mutation CreateLink($listing_id: ID!, $url: String!) {
    createLink(listing_id: $listing_id, url: $url) {
      ...AllLinkFields
    }
  }
`;
export const REMOVE_LINK = gql`
  ${LINK_FIELDS}
  mutation DeleteLink($id: ID!) {
    deleteLink(id: $id) {
      ...AllLinkFields
    }
  }
`;
export const EDIT_LINK = gql`
  ${LINK_FIELDS}
  mutation EditLink($key: String!, $value: String!, $id: ID!) {
    editLink(key: $key, value: $value, id: $id) {
      ...AllLinkFields
    }
  }
`;

export const CREATE_METRIC = gql`
  mutation CreateMetric(
    $type: String!
    $user_id: String
    $operation_name: String
    $operation_type: String
    $operation_variables: String
    $navigate_to: String
    $click_on: String
  ) {
    createMetric(
      type: $type
      user_id: $user_id
      operation_name: $operation_name
      operation_type: $operation_type
      operation_variables: $operation_variables
      navigate_to: $navigate_to
      click_on: $click_on
    ) {
      type
    }
  }
`;

export const CREATE_FEEDBACK = gql`
  mutation CreateFeedback($message: String!, $email: String) {
    createFeedback(message: $message, email: $email) {
      message
    }
  }
`;
