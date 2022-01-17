import React from "react";
import { render, screen } from "@testing-library/react";
import Home from "./Home";
import { MemoryRouter } from "react-router-dom";

test("renders home", () => {
  render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>,
  );
  const header = screen.getByText("Home");
  expect(header).not.toBeNull();
});
