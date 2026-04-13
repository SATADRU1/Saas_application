import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";

// ---------- mocks ----------

const mockConvexProviderRender = vi.fn(
  ({ children }: { children: React.ReactNode }) => (
    <div data-testid="convex-provider-in-theme">{children}</div>
  )
);

vi.mock("convex/react", () => ({
  ConvexProvider: (props: { children: React.ReactNode; client: unknown }) =>
    mockConvexProviderRender(props),
  ConvexReactClient: vi.fn().mockImplementation((url: string) => ({
    _url: url,
  })),
}));

vi.mock("next-themes", () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="next-themes-provider">{children}</div>
  ),
  useTheme: () => ({ resolvedTheme: "light", setTheme: vi.fn() }),
}));

// ---------- import after mocks ----------

import { ThemeProvider } from "../theme-provider";

describe("apps/web ThemeProvider (after convex integration)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders children inside ConvexProvider", () => {
    render(
      <ThemeProvider>
        <span data-testid="child">content</span>
      </ThemeProvider>
    );

    expect(screen.getByTestId("convex-provider-in-theme")).toBeInTheDocument();
    expect(screen.getByTestId("child")).toBeInTheDocument();
  });

  it("renders children text content correctly", () => {
    render(
      <ThemeProvider>
        <p>theme content</p>
      </ThemeProvider>
    );

    expect(screen.getByText("theme content")).toBeInTheDocument();
  });

  it("does NOT wrap children in NextThemesProvider anymore", () => {
    render(
      <ThemeProvider>
        <div data-testid="inner" />
      </ThemeProvider>
    );

    // The changed ThemeProvider replaced NextThemesProvider with ConvexProvider,
    // so the NextThemesProvider wrapper should not appear in the DOM.
    expect(
      screen.queryByTestId("next-themes-provider")
    ).not.toBeInTheDocument();
  });

  it("wraps children with ConvexProvider (behaviour change in this PR)", () => {
    render(
      <ThemeProvider>
        <div data-testid="inner" />
      </ThemeProvider>
    );

    expect(screen.getByTestId("convex-provider-in-theme")).toBeInTheDocument();
  });

  it("renders multiple children", () => {
    render(
      <ThemeProvider>
        <span data-testid="a">a</span>
        <span data-testid="b">b</span>
      </ThemeProvider>
    );

    expect(screen.getByTestId("a")).toBeInTheDocument();
    expect(screen.getByTestId("b")).toBeInTheDocument();
  });

  it("exports ThemeProvider as a named export", () => {
    expect(typeof ThemeProvider).toBe("function");
  });

  it("passes additional props through without crashing", () => {
    // ThemeProvider accepts ComponentProps<typeof NextThemesProvider>
    // Even though it no longer uses them, it should not throw.
    expect(() =>
      render(
        // @ts-expect-error testing props passthrough
        <ThemeProvider attribute="class" defaultTheme="dark">
          <div />
        </ThemeProvider>
      )
    ).not.toThrow();
  });

  it("renders without crashing when NEXT_PUBLIC_CONVEX_URL is not set", () => {
    const original = process.env.NEXT_PUBLIC_CONVEX_URL;
    delete process.env.NEXT_PUBLIC_CONVEX_URL;

    expect(() =>
      render(
        <ThemeProvider>
          <div />
        </ThemeProvider>
      )
    ).not.toThrow();

    process.env.NEXT_PUBLIC_CONVEX_URL = original;
  });
});