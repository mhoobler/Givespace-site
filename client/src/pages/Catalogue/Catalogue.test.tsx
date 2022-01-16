import React from "react";
import { screen, render } from "@testing-library/react";
import Catalogue from "./Catalogue";
import { MockedProvider } from "@apollo/client/testing";
import { JUNK_QUERY } from "../../graphql/schemas";
import { MemoryRouter, Route, Routes } from "react-router-dom";

const mocks = [
  {
    request: {
      query: JUNK_QUERY,
    },
    result: {
      data: {
        id: "id1",
        user_id: "id",
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
    </MockedProvider>,
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
    </MockedProvider>,
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
    </MockedProvider>,
  );

  const button = screen.getByText("Go Back");
  button.click();
});
