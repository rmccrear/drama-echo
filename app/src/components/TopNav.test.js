import { render, screen } from "@testing-library/react";
import TopNav from "./TopNav";
import { BrowserRouter, MemoryRouter } from "react-router-dom";

import testData from "../__test__/db-seeds";

const testUser = testData.users[0];

test("renders TopNav", async () => {
  render(<TopNav user={testUser} />, {
    wrapper: BrowserRouter,
  });
  const myDialogsElement = await screen.findByText(/My Dialogs/);
  expect(myDialogsElement).toBeInTheDocument();
});
