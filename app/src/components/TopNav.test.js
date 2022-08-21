import { render, screen } from "@testing-library/react";
import TopNav from "./TopNav";
import { BrowserRouter, MemoryRouter } from "react-router-dom";

test("renders learn react link", async () => {
  render(<TopNav user={{ name: "Alice", _id: 1 }} />, {
    wrapper: BrowserRouter,
  });
  const myDialogsElement = await screen.findByText(/My Dialogs/);
  expect(myDialogsElement).toBeInTheDocument();
});
