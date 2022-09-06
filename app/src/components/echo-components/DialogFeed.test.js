import { render, screen, fireEvent, act } from "@testing-library/react";

jest.mock("../../models/api");
jest.mock("../../withAuth");

import {
  getCalled,
  postCalled,
  putCalled,
  deleteCalled,
  resetMockCalls,
} from "../../models/api";

import DialogFeed from "./DialogFeed";
import EchoHome from "./EchoHome";
import DialogDisplay from "./DialogDisplay";

import { MemoryRouter, Routes, Route } from "react-router-dom";

import testData from "../../__test__/db-seeds";
const testDialogs = testData.dialogs;

describe("Dialog Feed", () => {
  beforeEach(() => {
    resetMockCalls();
  });

  test("renders DialogView", async () => {
    const dialog_id = testDialogs[0]._id;
    render(
      <MemoryRouter>
        <DialogFeed />
      </MemoryRouter>
    );
    const dialogFeedItem = await screen.findByText("First Dialog");
    expect(dialogFeedItem).toBeInTheDocument();
  });

  test("renders DialogView in Echo home (x and responds to click x)", async () => {
    const firstDialogId = testDialogs[0]._id;
    render(
      <MemoryRouter initialEntries={["/echoes"]}>
        <Routes>
          <Route path="echoes" element={<EchoHome />} />
          <Route
            path={`echo/${firstDialogId}`}
            element={<div>First Dialog Echo is here.</div>}
          />
        </Routes>
      </MemoryRouter>
    );
    const makeAnEchoButtons = await screen.findAllByText(/Make an Echo/i);
    expect(makeAnEchoButtons.length).toBe(testDialogs.length);
    // Clicking the button gets this strange error:
    // You should call navigate() in a React.useEffect(), not when your component is first rendered.
    // https://github.com/remix-run/react-router/issues/8809#issuecomment-1206013281
    //await fireEvent.click(makeAnEchoButtons[0]);
    //const mockEcho = await screen.findByText(/First Dialog Echo is here./i);
    //expect(mockEcho).toBeInTheDocument();
  });

  test("renders DialogDisplay and responds to click", async () => {
    const firstDialog = testDialogs[0];
    const firstDialogId = testDialogs[0]._id;
    render(
      <MemoryRouter initialEntries={["/echoes"]}>
        <Routes>
          <Route
            path="echoes"
            element={<DialogDisplay dialog={firstDialog} />}
          />
          <Route
            path={`echo/${firstDialogId}`}
            element={<div>First Dialog Echo is here.</div>}
          />
        </Routes>
      </MemoryRouter>
    );
    const makeAnEchoButton = await screen.findByText(/Make an Echo/i);
    expect(makeAnEchoButton).toBeInTheDocument();
    await fireEvent.click(makeAnEchoButton);
    const mockEcho = await screen.findByText(/First Dialog Echo is here./i);
    expect(mockEcho).toBeInTheDocument();
  });
});
