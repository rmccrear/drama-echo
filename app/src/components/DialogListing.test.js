import { render, screen, waitFor } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import DialogListing from "./DialogListing";

test("renders learn react link", async () => {
  await act(async () => {
    return Promise.resolve(
      render(<DialogListing user={{ name: "Alice", _id: 1 }} />)
    );
  });
  await waitFor(async () => {
    const dialog1Element = await screen.findByText(/First Dialog/);
    expect(dialog1Element).toBeInTheDocument();
    const dialog2Element = await screen.findByText(/Second Dialog/);
    expect(dialog2Element).toBeInTheDocument();
    const dialog3Element = await screen.queryByText(/Third Dialog/);
    expect(dialog3Element).toBeNull();
  });
});
