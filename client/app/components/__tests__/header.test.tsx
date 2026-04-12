import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { TestProviders } from "../../__tests__/helpers/TestProviders";
import Header from "../header";

const renderHeader = (props?: Partial<{ onSearch: any; onCreateMeeting: any }>) => {
  const onSearch = props?.onSearch ?? vi.fn();
  const onCreateMeeting = props?.onCreateMeeting ?? vi.fn().mockResolvedValue(undefined);
  const result = render(
    <TestProviders>
      <Header onCreateMeeting={onCreateMeeting} onSearch={onSearch} />
    </TestProviders>
  );
  return { ...result, onSearch, onCreateMeeting };
};

describe("Header search", () => {
  it("calls onSearch after debounce when typing in search field", () => {
    vi.useFakeTimers();
    const { onSearch } = renderHeader();

    const searchInput = screen.getByPlaceholderText("Search...");
    fireEvent.change(searchInput, { target: { value: "test" } });

    // Before debounce fires, onSearch should not have been called
    expect(onSearch).not.toHaveBeenCalled();

    // Advance past debounce timer (300ms)
    vi.advanceTimersByTime(350);

    expect(onSearch).toHaveBeenCalledWith("test");

    vi.useRealTimers();
  });

  it("does not call onSearch immediately", () => {
    vi.useFakeTimers();
    const { onSearch } = renderHeader();

    const searchInput = screen.getByPlaceholderText("Search...");
    fireEvent.change(searchInput, { target: { value: "test" } });

    // Before debounce fires
    expect(onSearch).not.toHaveBeenCalled();

    vi.useRealTimers();
  });
});
