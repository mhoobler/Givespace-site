import React from "react";
import { render, screen } from "@testing-library/react";
import Home from "./Home";
import { MemoryRouter, Route, Routes } from "react-router-dom";

test("renders home", () => {
  render(
    <MemoryRouter initialEntries={["/"]}>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </MemoryRouter>,
  );
  const header = screen.getByText(/Home/i);
  expect(header).not.toBeNull();
});
