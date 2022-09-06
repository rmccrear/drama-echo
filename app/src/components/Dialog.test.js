import { render, screen, fireEvent, act } from "@testing-library/react";

jest.mock("../models/api");
jest.mock("../withAuth");

import {
  getCalled,
  postCalled,
  putCalled,
  deleteCalled,
  resetMockCalls,
} from "../models/api";

import DialogView from "./DialogView";
import DialogUpdate from "./DialogUpdate";
import DialogCreate from "./DialogCreate";
import { BrowserRouter, MemoryRouter, Routes, Route } from "react-router-dom";

import testData from "../__test__/db-seeds";
const testDialogs = testData.dialogs;

describe("Dialog CRUD", () => {
  beforeEach(() => {
    resetMockCalls();
  });

  test("renders DialogView", async () => {
    const dialog_id = testDialogs[0]._id;
    const testRoute = `/dialogs/${dialog_id}`;
    render(
      <MemoryRouter initialEntries={[testRoute]}>
        <Routes>
          <Route path="/dialogs/:dialog_id" element={<DialogView />} />
        </Routes>
      </MemoryRouter>
    );
    const myDialogsElement = await screen.findByText(/First Dialog/);
    expect(myDialogsElement).toBeInTheDocument();
    expect(getCalled).toHaveBeenCalledWith(testRoute);
  });

  test("renders DialogUpdate", async () => {
    const dialog_id = testDialogs[1]._id;
    const testRoute = `/dialogs/${dialog_id}/edit`;
    render(
      <MemoryRouter initialEntries={[testRoute]}>
        <Routes>
          <Route path="/dialogs/:dialog_id/edit" element={<DialogUpdate />} />
          <Route
            path="/dialogs/:dialog_id"
            element={<div>Mock Updated Dialog</div>}
          />
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
    fireEvent.change(dialogTitleInput, { target: { value: "The Titanic" } });
    await fireEvent.click(await screen.findByText("Submit"));
    expect(putCalled).toHaveBeenCalledWith(`/dialogs/${dialog_id}`, {
      title: "The Titanic",
      characters: ["Rose", "Jack"],
    });
    // re-route to
    const myDialogsElement = await screen.findByText(/Mock Updated Dialog/);
    expect(myDialogsElement).toBeInTheDocument();
  });

  test("deletes Dialog from DialogUpdate", async () => {
    const testRoute = `/dialogs/${testDialogs[1]._id}/edit`;
    render(
      <MemoryRouter initialEntries={[testRoute]}>
        <Routes>
          <Route path="/dialogs/:dialog_id/edit" element={<DialogUpdate />} />
          <Route path="/dialogs" element={<div> Mock Dialog List </div>} />
        </Routes>
      </MemoryRouter>
    );
    const dialogTitleInput = await screen.findByPlaceholderText("Dialog Title");
    expect(dialogTitleInput).toBeInTheDocument();
    expect(dialogTitleInput).toHaveValue("Second Dialog");
    const deleteButton = await screen.findByText("Delete");
    await fireEvent.click(deleteButton);
    expect(deleteCalled).toHaveBeenCalled();
    // check redirect
    const listComponent = await screen.findByText("Mock Dialog List");
    expect(listComponent).toBeInTheDocument();
  });

  test("renders DialogCreate", async () => {
    const testRoute = "/dialogs/new";
    let testHistory, testLocation;
    render(
      <MemoryRouter initialEntries={[testRoute]}>
        <Routes>
          <Route path="/dialogs/new" element={<DialogCreate />} />
          <Route
            path="/dialogs/123created123"
            element={<div>Created New Dialog</div>}
          />
        </Routes>
      </MemoryRouter>
    );
    const dialogTitleInput = await screen.findByPlaceholderText("Dialog Title");
    expect(dialogTitleInput).toBeInTheDocument();
    const role1 = await screen.findByPlaceholderText("Role 1");
    const role2 = await screen.findByPlaceholderText("Role 2");
    expect(role1).toBeInTheDocument();
    expect(role2).toBeInTheDocument();

    fireEvent.change(dialogTitleInput, { target: { value: "The Titanic" } });
    fireEvent.change(role1, { target: { value: "Jack" } });
    fireEvent.change(role2, { target: { value: "Rose" } });
    expect(role1.value).toBe("Jack");
    expect(role2.value).toBe("Rose");
    await fireEvent.click(await screen.findByText("Submit"));
    expect(postCalled).toHaveBeenCalledWith("/dialogs", {
      title: "The Titanic",
      characters: ["Jack", "Rose"],
    });
    // re-route to
    const myDialogsElement = await screen.findByText(/Created New Dialog/);
    expect(myDialogsElement).toBeInTheDocument();
  });
});
