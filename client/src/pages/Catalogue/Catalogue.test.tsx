import React from "react";
import { screen, render } from "@testing-library/react";
import Catalogue from "./Catalogue";
import { MockedProvider } from "@apollo/client/testing";
import { GET_CATALOGUE } from "../../graphql/schemas";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { DocumentNode } from "graphql";

type Mock = {
  request: {
    query: DocumentNode;
  };
  result: {
    data: CatalogueType;
  };
};

const mocks: Mock[] = [
  {
    request: {
      query: GET_CATALOGUE,
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
        header_color: "#FF0000",
        edit_id: "asdf",
        author: "ahshaf",
        profile_picture_url: "eowert",
        event_date: null,
      },
    },
  },
];

test("Catalogue mounts with Params", () => {
  render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <MemoryRouter initialEntries={["/list/id1"]}>
        <Routes>
          <Route path="/list/:id" element={<Catalogue />} />
        </Routes>
      </MemoryRouter>
    </MockedProvider>
  );

  setTimeout(() => {
    const text = screen.getByText("Catalogue: id1");
    expect(text).not.toBeNull();
  }, 0);
});

test("useQuery fires on mount and renders result", () => {
  render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <MemoryRouter initialEntries={["/list/id1"]}>
        <Routes>
          <Route path="/list/:id" element={<Catalogue />} />
        </Routes>
      </MemoryRouter>
    </MockedProvider>
  );

  setTimeout(() => {
    const text = screen.getByText("User: id");
    expect(text).not.toBeNull();
  }, 0);
});

test("Go Back is clickable", () => {
  render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <MemoryRouter initialEntries={["/list/id1"]}>
        <Routes>
          <Route path="/list/:id" element={<Catalogue />} />
        </Routes>
      </MemoryRouter>
    </MockedProvider>
  );

  const button = screen.getByText("Go Back");
  button.click();
});
