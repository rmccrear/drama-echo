import { render, screen } from "@testing-library/react";
import DialogView from "./DialogView";
import DialogUpdate from "./DialogUpdate";
import DialogCreate from "./DialogCreate";
import { BrowserRouter, MemoryRouter, Routes, Route } from "react-router-dom";

import testData from "../__test__/db-seeds";
const testDialogs = testData.dialogs;

describe("Dialog CRUD", () => {
  test("renders DialogView", async () => {
    const testRoute = `/dialogs/${testDialogs[0]._id}`;
    render(
      <MemoryRouter initialEntries={[testRoute]}>
        <Routes>
          <Route path="dialogs/:dialog_id" element={<DialogView />} />
        </Routes>
      </MemoryRouter>
    );
    const myDialogsElement = await screen.findByText(/First Dialog/);
    expect(myDialogsElement).toBeInTheDocument();
  });
  test("renders DialogUpdate", async () => {
    const testRoute = `/dialogs/${testDialogs[1]._id}/edit`;
    render(
      <MemoryRouter initialEntries={[testRoute]}>
        <Routes>
          <Route path="dialogs/:dialog_id/edit" element={<DialogUpdate />} />
        </Routes>
      </MemoryRouter>
    );
    const dialogTitleInput = await screen.findByPlaceholderText("Dialog Title");
    expect(dialogTitleInput).toBeInTheDocument();
    expect(dialogTitleInput).toHaveValue("Second Dialog");
    const role1 = await screen.findByPlaceholderText("Role 1");
    const role2 = await screen.findByPlaceholderText("Role 2");
    expect(role1).toHaveValue("Rose");
    expect(role2).toHaveValue("Jack");
  });
  test("renders DialogCreate", async () => {
    render(<DialogCreate />);
    const dialogTitleInput = await screen.findByPlaceholderText("Dialog Title");
    expect(dialogTitleInput).toBeInTheDocument();
    const role1 = await screen.findByPlaceholderText("Role 1");
    const role2 = await screen.findByPlaceholderText("Role 2");
    expect(role1).toBeInTheDocument();
    expect(role2).toBeInTheDocument();
  });
});
