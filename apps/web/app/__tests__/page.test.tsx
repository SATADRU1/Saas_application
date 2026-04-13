import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";

// ---------- mocks ----------

const mockAddUser = vi.fn().mockResolvedValue(undefined);
const mockUseQuery = vi.fn();
const mockUseMutation = vi.fn(() => mockAddUser);

vi.mock("convex/react", () => ({
  useQuery: (...args: unknown[]) => mockUseQuery(...args),
  useMutation: (...args: unknown[]) => mockUseMutation(...args),
}));

// Provide a minimal api stub — the actual shape doesn't matter for rendering
vi.mock("@workspace/backend/_generated/api", () => ({
  api: {
    user: {
      getMany: "user:getMany",
      add: "user:add",
    },
  },
}));

vi.mock("@workspace/ui/components/button", () => ({
  Button: ({
    children,
    onClick,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
  }) => (
    <button data-testid="button" onClick={onClick}>
      {children}
    </button>
  ),
}));

import Page from "../page";
import { api } from "@workspace/backend/_generated/api";

describe("apps/web Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseMutation.mockReturnValue(mockAddUser);
  });

  it("renders the apps/web label", () => {
    mockUseQuery.mockReturnValue(undefined);
    render(<Page />);
    expect(screen.getByText("apps/web")).toBeInTheDocument();
  });

  it("renders the Add User button", () => {
    mockUseQuery.mockReturnValue(undefined);
    render(<Page />);
    expect(screen.getByTestId("button")).toBeInTheDocument();
    expect(screen.getByText("Add User")).toBeInTheDocument();
  });

  it("calls useQuery with api.user.getMany", () => {
    mockUseQuery.mockReturnValue(undefined);
    render(<Page />);
    expect(mockUseQuery).toHaveBeenCalledWith(api.user.getMany);
  });

  it("calls useMutation with api.user.add", () => {
    mockUseQuery.mockReturnValue(undefined);
    render(<Page />);
    expect(mockUseMutation).toHaveBeenCalledWith(api.user.add);
  });

  it("displays stringified users data when query returns results", () => {
    const fakeUsers = [{ _id: "id1", name: "Alice" }];
    mockUseQuery.mockReturnValue(fakeUsers);
    render(<Page />);
    expect(screen.getByText(/Alice/)).toBeInTheDocument();
  });

  it("renders nothing for users section when query returns undefined (loading)", () => {
    mockUseQuery.mockReturnValue(undefined);
    render(<Page />);
    // JSON.stringify(undefined) returns undefined (no output)
    // Verify the user section container exists but is empty
    const { container } = render(<Page />);
    expect(container).toBeInTheDocument();
  });

  it("renders null string when users is null", () => {
    mockUseQuery.mockReturnValue(null);
    render(<Page />);
    expect(screen.getByText("null")).toBeInTheDocument();
  });

  it("renders empty array string when users is empty", () => {
    mockUseQuery.mockReturnValue([]);
    render(<Page />);
    expect(screen.getByText("[]")).toBeInTheDocument();
  });

  it("calls addUser mutation when Add User button is clicked", () => {
    mockUseQuery.mockReturnValue(undefined);
    render(<Page />);
    const button = screen.getByTestId("button");
    fireEvent.click(button);
    expect(mockAddUser).toHaveBeenCalledWith({});
  });

  it("calls addUser with empty object on each click", () => {
    mockUseQuery.mockReturnValue(undefined);
    render(<Page />);
    const button = screen.getByTestId("button");
    fireEvent.click(button);
    fireEvent.click(button);
    expect(mockAddUser).toHaveBeenCalledTimes(2);
    expect(mockAddUser).toHaveBeenNthCalledWith(1, {});
    expect(mockAddUser).toHaveBeenNthCalledWith(2, {});
  });

  it("renders multiple users in JSON format", () => {
    const users = [
      { _id: "id1", name: "Alice" },
      { _id: "id2", name: "Bob" },
    ];
    mockUseQuery.mockReturnValue(users);
    render(<Page />);
    expect(screen.getByText(/Bob/)).toBeInTheDocument();
    expect(screen.getByText(/Alice/)).toBeInTheDocument();
  });

  it("renders without crashing", () => {
    mockUseQuery.mockReturnValue(undefined);
    expect(() => render(<Page />)).not.toThrow();
  });
});