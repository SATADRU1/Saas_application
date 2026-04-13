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

describe("apps/widget Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseMutation.mockReturnValue(mockAddUser);
  });

  it("renders the apps/widget label", () => {
    mockUseQuery.mockReturnValue(undefined);
    render(<Page />);
    expect(screen.getByText("apps/widget")).toBeInTheDocument();
  });

  it("does NOT render apps/web label (correct app label check)", () => {
    mockUseQuery.mockReturnValue(undefined);
    render(<Page />);
    expect(screen.queryByText("apps/web")).not.toBeInTheDocument();
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
    const fakeUsers = [{ _id: "id1", name: "Charlie" }];
    mockUseQuery.mockReturnValue(fakeUsers);
    render(<Page />);
    expect(screen.getByText(/Charlie/)).toBeInTheDocument();
  });

  it("renders null string when users is null", () => {
    mockUseQuery.mockReturnValue(null);
    render(<Page />);
    expect(screen.getByText("null")).toBeInTheDocument();
  });

  it("renders empty array string when users is empty array", () => {
    mockUseQuery.mockReturnValue([]);
    render(<Page />);
    expect(screen.getByText("[]")).toBeInTheDocument();
  });

  it("calls addUser mutation with empty object when button is clicked", () => {
    mockUseQuery.mockReturnValue(undefined);
    render(<Page />);
    const button = screen.getByTestId("button");
    fireEvent.click(button);
    expect(mockAddUser).toHaveBeenCalledWith({});
  });

  it("calls addUser multiple times on repeated clicks", () => {
    mockUseQuery.mockReturnValue(undefined);
    render(<Page />);
    const button = screen.getByTestId("button");
    fireEvent.click(button);
    fireEvent.click(button);
    fireEvent.click(button);
    expect(mockAddUser).toHaveBeenCalledTimes(3);
  });

  it("renders multiple users in JSON format", () => {
    const users = [
      { _id: "w1", name: "Dave" },
      { _id: "w2", name: "Eve" },
    ];
    mockUseQuery.mockReturnValue(users);
    render(<Page />);
    expect(screen.getByText(/Dave/)).toBeInTheDocument();
    expect(screen.getByText(/Eve/)).toBeInTheDocument();
  });

  it("renders without crashing", () => {
    mockUseQuery.mockReturnValue(undefined);
    expect(() => render(<Page />)).not.toThrow();
  });
});