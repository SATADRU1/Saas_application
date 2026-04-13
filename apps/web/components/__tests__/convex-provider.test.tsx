import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";

// Mock ConvexReactClient and ConvexProvider before importing the module under test.
// ConvexReactClient is instantiated at module level in convex-provider.tsx, so
// constructor call counts are only visible *before* vi.clearAllMocks() runs.
// Tests therefore check rendered output and prop shapes rather than spy call counts.

const mockConvexProviderRender = vi.fn(
  ({ children }: { children: React.ReactNode }) => (
    <div data-testid="convex-provider-mock">{children}</div>
  )
);

vi.mock("convex/react", () => ({
  ConvexProvider: (props: { children: React.ReactNode; client: unknown }) =>
    mockConvexProviderRender(props),
  ConvexReactClient: vi.fn().mockImplementation((url: string) => ({
    _url: url,
  })),
}));

// Import after mock setup
import { Provider } from "../convex-provider";

describe("apps/web Provider (convex-provider)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders children inside ConvexProvider", () => {
    render(
      <Provider>
        <span data-testid="child">hello</span>
      </Provider>
    );

    expect(screen.getByTestId("convex-provider-mock")).toBeInTheDocument();
    expect(screen.getByTestId("child")).toBeInTheDocument();
    expect(screen.getByText("hello")).toBeInTheDocument();
  });

  it("passes a non-null client prop to ConvexProvider", () => {
    render(
      <Provider>
        <div />
      </Provider>
    );

    // mockConvexProviderRender captures the props passed to ConvexProvider
    expect(mockConvexProviderRender).toHaveBeenCalledOnce();
    const receivedProps = mockConvexProviderRender.mock.calls[0][0] as {
      client: unknown;
      children: React.ReactNode;
    };
    expect(receivedProps.client).not.toBeNull();
    expect(receivedProps.client).not.toBeUndefined();
  });

  it("passes a client object (ConvexReactClient instance) to ConvexProvider", () => {
    render(
      <Provider>
        <div />
      </Provider>
    );

    const receivedProps = mockConvexProviderRender.mock.calls[0][0] as {
      client: unknown;
    };
    // The mock ConvexReactClient returns { _url: string }
    expect(typeof receivedProps.client).toBe("object");
  });

  it("uses env var NEXT_PUBLIC_CONVEX_URL as the client URL (or empty string fallback)", () => {
    render(
      <Provider>
        <div />
      </Provider>
    );

    const receivedProps = mockConvexProviderRender.mock.calls[0][0] as {
      client: { _url: string };
    };
    const expectedUrl = process.env.NEXT_PUBLIC_CONVEX_URL ?? "";
    expect(receivedProps.client._url).toBe(expectedUrl);
  });

  it("renders multiple children correctly", () => {
    render(
      <Provider>
        <span data-testid="child-1">first</span>
        <span data-testid="child-2">second</span>
      </Provider>
    );

    expect(screen.getByTestId("child-1")).toBeInTheDocument();
    expect(screen.getByTestId("child-2")).toBeInTheDocument();
  });

  it("exports Provider as a named export", () => {
    expect(typeof Provider).toBe("function");
  });

  it("renders without crashing when children is a single element", () => {
    expect(() =>
      render(
        <Provider>
          <div>content</div>
        </Provider>
      )
    ).not.toThrow();
  });
});