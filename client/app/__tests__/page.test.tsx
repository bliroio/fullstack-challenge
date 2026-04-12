import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { server } from "./mocks/server";
import { http, HttpResponse } from "msw";
import { TestProviders } from "./helpers/TestProviders";
import Home from "../page";

const API_URL = "http://localhost:3000/api/meetings";

describe("Home page states", () => {
  it("shows loading spinner while fetching", async () => {
    // Override: handler never resolves
    server.use(
      http.get(API_URL, () => {
        return new Promise(() => {}); // never resolves
      })
    );

    render(
      <TestProviders>
        <Home />
      </TestProviders>
    );

    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("shows error message when API fails", async () => {
    server.use(
      http.get(API_URL, () => {
        return HttpResponse.error();
      })
    );

    render(
      <TestProviders>
        <Home />
      </TestProviders>
    );

    await waitFor(() => {
      expect(
        screen.getByText("Failed to load meetings. Please try again.")
      ).toBeInTheDocument();
    });
  });

  it("shows empty state when no meetings", async () => {
    server.use(
      http.get(API_URL, () => {
        return HttpResponse.json({
          docs: [],
          totalDocs: 0,
          limit: 100,
          hasPrevPage: false,
          hasNextPage: false,
          page: 1,
          totalPages: 0,
          offset: 0,
          prevPage: null,
          nextPage: null,
          pagingCounter: 1,
        });
      })
    );

    render(
      <TestProviders>
        <Home />
      </TestProviders>
    );

    await waitFor(() => {
      expect(screen.getByText("No meetings found")).toBeInTheDocument();
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    });
  });

  it("displays meetings when API returns data", async () => {
    server.use(
      http.get(API_URL, () => {
        return HttpResponse.json({
          docs: [
            {
              id: "1",
              title: "Daily Standup",
              startTime: "2025-01-15T09:00:00.000Z",
              endTime: "2025-01-15T09:30:00.000Z",
            },
            {
              id: "2",
              title: "Sprint Retro",
              startTime: "2025-01-15T14:00:00.000Z",
              endTime: "2025-01-15T15:00:00.000Z",
            },
          ],
          totalDocs: 2,
          limit: 100,
          hasPrevPage: false,
          hasNextPage: false,
          page: 1,
          totalPages: 1,
          offset: 0,
          prevPage: null,
          nextPage: null,
          pagingCounter: 1,
        });
      })
    );

    render(
      <TestProviders>
        <Home />
      </TestProviders>
    );

    await waitFor(() => {
      expect(screen.getByText("Daily Standup")).toBeInTheDocument();
      expect(screen.getByText("Sprint Retro")).toBeInTheDocument();
    });
  });
});
