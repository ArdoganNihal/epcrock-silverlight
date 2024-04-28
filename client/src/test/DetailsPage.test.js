import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import DetailsPage from "../components/DetailsPage";

describe("DetailsPage Component", () => {
  const mockTechs = [
    { name: "React", categories: ["JavaScript Framework"] },
    { name: "Node.js", categories: ["Runtime Environment"] },
  ];

  it("renders the details page with given state from router", () => {
    render(
      <MemoryRouter
        initialEntries={[
          {
            pathname: "/details",
            state: {
              url: "https://example.com",
              technologies: mockTechs,
              pageCount: 5,
            },
          },
        ]}
      >
        <Routes>
          <Route path="/details" element={<DetailsPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("https://example.com Results")).toBeInTheDocument();
    expect(screen.getByText("5 Pages Found")).toBeInTheDocument();
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("JavaScript Framework")).toBeInTheDocument();
    expect(screen.getByText("Node.js")).toBeInTheDocument();
    expect(screen.getByText("Runtime Environment")).toBeInTheDocument();
  });

  it("handles missing state gracefully", () => {
    render(
      <MemoryRouter initialEntries={["/details"]}>
        <Routes>
          <Route path="/details" element={<DetailsPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("undefined Results")).toBeInTheDocument();
    expect(screen.getByText("0 Pages Found")).toBeInTheDocument();
    expect(screen.queryByText("React")).not.toBeInTheDocument();
  });
});
