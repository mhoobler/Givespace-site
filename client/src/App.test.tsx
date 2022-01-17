import React from "react";
import { render } from "@testing-library/react";
import App from "./App";
import { MockedProvider } from "@apollo/client/testing";
import { GET_JWT } from "./graphql/schemas";

const mocks = [
  {
    request: {
      query: GET_JWT,
    },
    result: {
      data: {
        jwt: true,
      },
    },
  },
];

test("renders learn react link", () => {
  render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <App />
    </MockedProvider>,
  );
});
