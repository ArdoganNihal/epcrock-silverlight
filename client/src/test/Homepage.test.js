import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import HomePage from "../components/Homepage";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";

// API ve localStorage mock'lamak için jest fonksiyonlarını kullanıyoruz.
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ status: "Analysing..." }),
  })
);

jest.spyOn(window.localStorage.__proto__, "setItem");
jest.spyOn(window.localStorage.__proto__, "getItem");

beforeEach(() => {
  fetch.mockClear();
  localStorage.setItem.mockClear();
  localStorage.getItem.mockClear();
});

describe("HomePage", () => {
  it("renders correctly", () => {
    render(<HomePage />, { wrapper: MemoryRouter });
    expect(screen.getByText("Silverlight Dashboard")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Enter website URL")
    ).toBeInTheDocument();
    expect(screen.getByText("Analyse")).toBeInTheDocument();
  });

  it("validates URL before submission", async () => {
    render(<HomePage />, { wrapper: MemoryRouter });
    const input = screen.getByPlaceholderText("Enter website URL");
    const button = screen.getByText("Analyse");

    userEvent.type(input, "not-a-valid-url");
    expect(button).toBeDisabled();

    userEvent.clear(input);
    userEvent.type(input, "https://www.validurl.com");
    expect(button).not.toBeDisabled();
  });

  it("submits a valid URL and updates the queue", async () => {
    render(<HomePage />, { wrapper: MemoryRouter });
    const input = screen.getByPlaceholderText("Enter website URL");
    const button = screen.getByText("Analyse");

    userEvent.type(input, "https://www.validurl.com");
    fireEvent.click(button);

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
    expect(fetch).toHaveBeenCalledWith(expect.any(String), expect.any(Object));
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
  });

  it("handles API and localStorage interactions correctly", async () => {
    localStorage.getItem.mockReturnValue(
      JSON.stringify([
        { url: "https://www.example.com", status: "Analysing..." },
      ])
    );
    render(<HomePage />, { wrapper: MemoryRouter });

    expect(localStorage.getItem).toHaveBeenCalledWith("analyses");
    const listItems = screen.queryAllByText(/Analysing...$/);
    expect(listItems).toHaveLength(1); // Assuming previous state had one item
  });
});
