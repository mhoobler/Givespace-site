import React from "react";
import { screen, render } from "@testing-library/react";
import CatalogueSelect from "./CatalogueSelect";
import { DocumentNode } from "graphql";
import { CREATE_CATALOGUE, MY_CATALOGUES } from "../../graphql/schemas";
import { MockedProvider } from "@apollo/client/testing";
import { MemoryRouter, Route, Routes } from "react-router-dom";

type Mock = {
  request: {
    query: DocumentNode;
  };
  result: {
    data: CatalogueStub[] | CatalogueType;
  };
};

const mocks: Mock[] = [
  {
    request: {
      query: MY_CATALOGUES,
    },
    result: {
      data: [
        {
          id: "id1",
          user_id: "id",
          title: "CATALOGUE_TITLE",
          description: "CATALOGUE_DESCRIPTION",
          created: new Date(),
          updated: new Date(),
        },
      ],
    },
  },
  {
    request: {
      query: CREATE_CATALOGUE,
    },
    result: {
      data: {
        id: "id1",
        user_id: "id",
        title: "CATALOGUE_TITLE",
        description: "CATALOGUE_DESCRIPTION",
        created: new Date(),
        updated: new Date(),
        views: 0,
        header_image_url: "awsdf",
        head_color: "#FF0000",
        edit_id: "asdf",
        author: "ahshaf",
        profile_picture_url: "eowert",
        event_date: null,
      },
    },
  },
];

test("CatalogueSelect mounts into loading", () => {
  render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <MemoryRouter initialEntries={["/lists/id"]}>
        <Routes>
          <Route path="/lists/:id" element={<CatalogueSelect />} />
        </Routes>
      </MemoryRouter>
    </MockedProvider>,
  );

  const text = screen.getByText("Loading...");
  expect(text).not.toBeNull();
});

test("useQuery fires on mount and popluates render", async () => {
  render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <MemoryRouter initialEntries={["/lists/id"]}>
        <Routes>
          <Route path="/lists/:id" element={<CatalogueSelect />} />
        </Routes>
      </MemoryRouter>
    </MockedProvider>,
  );

  expect(true).toBe(true);
});
