import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders learn react link", async () => {
  render(<App />);
  const linkElement = await screen.findByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
  const dialog1Element = await screen.findByText(/First Dialog/);
  expect(dialog1Element).toBeInTheDocument();
});
