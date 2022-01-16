import { gql } from "@apollo/client";

export const GET_JWT = gql`
  query getJwt {
    getJwt
  }
`;

export const JUNK_QUERY = gql`
  query getCatalogue($id: String) {
    catalogue(id: $id) {
      id
      user_id
      title
      created
      updated
      views
      header_image_url
      head_color
      edit_id
      author
      profile_picture_url
      event_date
    }
  }
`;
