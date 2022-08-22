import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter, MemoryRouter } from "react-router-dom";
import DialogListing from "./DialogListing";

import testData from "../__test__/db-seeds";

const testUser = testData.users[0];

test("renders learn react link", async () => {
  render(<DialogListing user={testUser} />, {
    wrapper: BrowserRouter,
  });
  const dialog1Element = await screen.findByText(/First Dialog/);
  expect(dialog1Element).toBeInTheDocument();
  const dialog2Element = await screen.findByText(/Second Dialog/);
  expect(dialog2Element).toBeInTheDocument();
  const dialog3Element = await screen.queryByText(/Third Dialog/);
  expect(dialog3Element).toBeNull();
});
