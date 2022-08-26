import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter, MemoryRouter } from "react-router-dom";
import App from "./App";

jest.mock("./withAuth");
jest.mock("./models/api");

test("renders Home route", async () => {
  render(<App />, { wrapper: BrowserRouter });
  const linkElement = await screen.findByText(/Get Started/i);
  expect(linkElement).toBeInTheDocument();
});

test("renders DialogList route", async () => {
  render(
    <MemoryRouter initialEntries={["/dialogs"]}>
      <App />
    </MemoryRouter>
  );
  const myDialogsLink = await screen.findByText(/My Dialogs/);
  expect(myDialogsLink).toBeInTheDocument();
  const dialogElement = await screen.findByText(/First Dialog/);
  expect(dialogElement).toBeInTheDocument();
});
