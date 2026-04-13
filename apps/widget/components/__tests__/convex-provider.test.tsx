import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";

// Mock ConvexReactClient and ConvexProvider before importing the module
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

import * as convexProviderModule from "../convex-provider";

describe("apps/widget Provider (convex-provider)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders children inside ConvexProvider", () => {
    render(
      <convexProviderModule.Provider>
        <span data-testid="child">widget child</span>
      </convexProviderModule.Provider>
    );

    expect(screen.getByTestId("convex-provider-mock")).toBeInTheDocument();
    expect(screen.getByTestId("child")).toBeInTheDocument();
    expect(screen.getByText("widget child")).toBeInTheDocument();
  });

  it("passes a non-null client prop to ConvexProvider", () => {
    render(
      <convexProviderModule.Provider>
        <div />
      </convexProviderModule.Provider>
    );

    // mockConvexProviderRender captures the props passed to ConvexProvider
    expect(mockConvexProviderRender).toHaveBeenCalledOnce();
    const receivedProps = mockConvexProviderRender.mock.calls[0][0] as {
      client: unknown;
    };
    expect(receivedProps.client).not.toBeNull();
    expect(receivedProps.client).not.toBeUndefined();
  });

  it("passes a client with the env var URL (or empty string fallback)", () => {
    render(
      <convexProviderModule.Provider>
        <div />
      </convexProviderModule.Provider>
    );

    const receivedProps = mockConvexProviderRender.mock.calls[0][0] as {
      client: { _url: string };
    };
    const expectedUrl = process.env.NEXT_PUBLIC_CONVEX_URL ?? "";
    expect(receivedProps.client._url).toBe(expectedUrl);
  });

  it("exports Provider as a named function export", () => {
    expect(typeof convexProviderModule.Provider).toBe("function");
  });

  /**
   * Regression test: apps/widget/app/layout.tsx imports { ConvexClientProvider }
   * from "@/components/convex-provider", but this file only exports "Provider".
   * This test documents the missing export so the mismatch is visible.
   */
  it("does NOT export ConvexClientProvider (mismatch with layout.tsx import)", () => {
    expect(
      (convexProviderModule as Record<string, unknown>).ConvexClientProvider
    ).toBeUndefined();
  });

  it("renders multiple children without error", () => {
    expect(() =>
      render(
        <convexProviderModule.Provider>
          <span data-testid="a">a</span>
          <span data-testid="b">b</span>
        </convexProviderModule.Provider>
      )
    ).not.toThrow();

    expect(screen.getByTestId("a")).toBeInTheDocument();
    expect(screen.getByTestId("b")).toBeInTheDocument();
  });

  it("renders without crashing when no env var is set", () => {
    const original = process.env.NEXT_PUBLIC_CONVEX_URL;
    delete process.env.NEXT_PUBLIC_CONVEX_URL;

    expect(() =>
      render(
        <convexProviderModule.Provider>
          <div>content</div>
        </convexProviderModule.Provider>
      )
    ).not.toThrow();

    process.env.NEXT_PUBLIC_CONVEX_URL = original;
  });
});