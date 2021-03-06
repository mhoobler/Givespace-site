import { gql } from "@apollo/client";
import { ALL_CATALOGUE_FIELDS, CATALOGUE_LIST_ITEM_FIELDS } from "./fragments";

export const GET_JWT = gql`
  query GetJwt {
    getJwt
  }
`;

export const GET_CATALOGUE = gql`
  ${ALL_CATALOGUE_FIELDS}
  query Catalogues($id: ID) {
    catalogues(id: $id) {
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
  ${ALL_CATALOGUE_FIELDS}
  mutation CreateCatalogue {
    createCatalogue {
      ...AllCatalogueFields
    }
  }
`;

export const DELTETE_CATALOGUE = gql`
  ${CATALOGUE_LIST_ITEM_FIELDS}
  mutation DeleteCatalogue($id: ID!) {
    deleteCatalogue(id: $id) {
      ...CatalogueListItemFields
    }
  }
`;

export const INCREMENT_CATALOGUE_VIEWS = gql`
  ${ALL_CATALOGUE_FIELDS}
  mutation IncrementCatalogueViews($id: ID!) {
    incrementCatalogueViews(id: $id) {
      ...AllCatalogueFields
    }
  }
`;

export const LIVE_CATALOGUE = gql`
  ${ALL_CATALOGUE_FIELDS}
  subscription LiveCatalogue($id: ID!) {
    liveCatalogue(id: $id) {
      ...AllCatalogueFields
    }
  }
`;
