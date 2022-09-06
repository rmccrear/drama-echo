import {
  render,
  screen,
  fireEvent,
  act,
  queryByText,
  findByDisplayValue,
} from "@testing-library/react";

jest.mock("../models/api");
jest.mock("../withAuth");

import { config } from "react-transition-group";
config.disabled = true;

import {
  getCalled,
  postCalled,
  putCalled,
  deleteCalled,
  resetMockCalls,
} from "../models/api";

import LineListing from "./LineListing";

import testData from "../__test__/db-seeds";
const testDialogs = testData.dialogs;

describe("LineListing", () => {
  beforeEach(() => {
    resetMockCalls();
  });

  test("renders LineListing", async () => {
    const testDialog = testDialogs[1];
    render(<LineListing lines={testDialog.lines} dialog={testDialog} />);

    const FirstLineContent = await screen.findByText(/Promise me now./i);
    expect(FirstLineContent).toBeInTheDocument();

    const SecondLineContent = await screen.findByText(/I promise./i);
    expect(SecondLineContent).toBeInTheDocument();
  });

  test("edit button", async () => {
    const testDialog = testDialogs[1];
    render(<LineListing lines={testDialog.lines} dialog={testDialog} />);
    const editButtons = await screen.findAllByText(/Edit/i);
    const editButton = editButtons[0];
    await fireEvent.click(editButton);
    expect(
      await screen.findByText("1. Choose the character who speaks this dialog.")
    ).toBeInTheDocument();
    expect(
      await screen.findByText("2. Write the line of dialog here.")
    ).toBeInTheDocument();
    expect(await screen.findByText("3. Select Audio.")).toBeInTheDocument();
  });

  test("delete button", async () => {
    const testDialog = testDialogs[1];
    const dialog_id = testDialog._id;
    const line_id = testDialog.lines[0]._id;
    render(<LineListing lines={testDialog.lines} dialog={testDialog} />);

    const editButtons = await screen.findAllByText(/Edit/i);
    const editButton = editButtons[0];
    await fireEvent.click(editButton);
    const deleteButton = await screen.findByText(/Delete/i);
    await act(async () => await fireEvent.click(deleteButton));

    // expect first call axios.delete to have argument be expectedDeleteUrl
    const expectedDeleteUrl = `/dialogs/${dialog_id}/lines/${line_id}`;
    expect(deleteCalled.mock.calls.length).toBe(1);

    expect(deleteCalled.mock.calls[0][0]).toBe(expectedDeleteUrl);
    await screen.findByText(/I promise./);
    // await screen.findByText(/Deleting/i); // this disappears too fast to see it.
    const deletedContent = screen.queryByText(/Promise me now./);
    expect(deletedContent).toBeNull();
  });

  test("sumbit button", async () => {
    const testDialog = testDialogs[1];
    const dialog_id = testDialog._id;
    const line_id = testDialog.lines[0]._id;
    render(<LineListing lines={testDialog.lines} dialog={testDialog} />);

    const editButtons = await screen.findAllByText(/Edit/i);
    const editButton = editButtons[0];
    await fireEvent.click(editButton);
    const submitButton = await screen.findByText(/Submit/i);

    //const selectInput = await screen.findByDisplayValue("Jack");
    //expect(selectInput).toBeInTheDocument();
    const contentInput = await screen.findByDisplayValue("Promise me now.");
    expect(contentInput).toBeInTheDocument();
    fireEvent.change(contentInput, { target: { value: "Promise me now!" } });
    await act(async () => await fireEvent.click(submitButton));

    // expect first call axios.delete to have argument be expectedDeleteUrl
    const expectedSubmitUrl = `/dialogs/${dialog_id}/lines/${line_id}`;
    expect(putCalled.mock.calls.length).toBe(1);
    expect(putCalled.mock.calls[0][0]).toBe(expectedSubmitUrl);

    expect(await screen.findByText("Promise me now!")).toBeInTheDocument();
    expect(screen.queryByText("Promise me now.")).toBeNull();
  });
});
