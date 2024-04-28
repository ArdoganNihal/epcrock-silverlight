import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "./App";
import { MemoryRouter, Route, Routes } from "react-router-dom";

describe("App Routing", () => {
  test("renders HomePage component on root path", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText("Silverlight Dashboard")).toBeInTheDocument(); // Varsayım: HomePage'de bu metin bulunuyor
  });

  test('renders DetailsPage component on "/details" path', () => {
    render(
      <MemoryRouter initialEntries={["/details"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText("Results")).toBeInTheDocument(); // Varsayım: DetailsPage'de bu metin bulunuyor
  });
});
