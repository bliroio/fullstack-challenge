import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { TestProviders } from "../../../../__tests__/helpers/TestProviders";
import { CreateMeetingForm } from "../CreateMeetingForm";

const renderForm = (props?: Partial<{ onSubmit: any; onClose: any }>) => {
  const onSubmit = props?.onSubmit ?? vi.fn().mockResolvedValue(undefined);
  const onClose = props?.onClose ?? vi.fn();
  const result = render(
    <TestProviders>
      <CreateMeetingForm onSubmit={onSubmit} onClose={onClose} />
    </TestProviders>
  );
  return { ...result, onSubmit, onClose };
};

describe("CreateMeetingForm", () => {
  it("shows validation error when title is cleared", async () => {
    const user = userEvent.setup();
    renderForm();

    const titleInput = screen.getByPlaceholderText("Write your meeting title");
    await user.type(titleInput, "Hello");
    await user.clear(titleInput);

    await waitFor(() => {
      expect(screen.getByText("Meeting title is required")).toBeInTheDocument();
    });
  });

  it("submit button disabled when form is invalid", async () => {
    const user = userEvent.setup();
    renderForm();

    const titleInput = screen.getByPlaceholderText("Write your meeting title");
    await user.type(titleInput, "x");
    await user.clear(titleInput);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /save/i })).toBeDisabled();
    });
  });

  it("calls onSubmit with Date objects on valid submit", async () => {
    const user = userEvent.setup();
    const { onSubmit } = renderForm();

    const titleInput = screen.getByPlaceholderText("Write your meeting title");
    await user.type(titleInput, "Team Standup");

    const saveButton = screen.getByRole("button", { name: /save/i });
    await user.click(saveButton);

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledTimes(1);
      const arg = onSubmit.mock.calls[0][0];
      expect(arg.title).toBe("Team Standup");
      // startTime and endTime should be Date objects
      expect(arg.startTime).toBeInstanceOf(Date);
      expect(arg.endTime).toBeInstanceOf(Date);
    });
  });

  it("double-click only fires onSubmit once", async () => {
    const user = userEvent.setup();
    const slowSubmit = vi.fn(
      () => new Promise((resolve) => setTimeout(resolve, 500))
    );
    renderForm({ onSubmit: slowSubmit });

    const titleInput = screen.getByPlaceholderText("Write your meeting title");
    await user.type(titleInput, "Team Standup");

    const saveButton = screen.getByRole("button", { name: /save/i });
    await user.dblClick(saveButton);

    await waitFor(() => {
      expect(slowSubmit).toHaveBeenCalledTimes(1);
    });
  });

  it("cancel resets form and calls onClose", async () => {
    const user = userEvent.setup();
    const { onClose } = renderForm();

    const titleInput = screen.getByPlaceholderText("Write your meeting title");
    await user.type(titleInput, "Something");

    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    await user.click(cancelButton);

    expect(onClose).toHaveBeenCalledTimes(1);
    // After reset, title field should be empty
    expect(titleInput).toHaveValue("");
  });
});
