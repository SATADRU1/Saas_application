import { Geist, Geist_Mono, Inter } from "next/font/google"
import { ClerkProvider } from "@clerk/nextjs"

import "@workspace/ui/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Provider } from "@/components/convex-provider"
import { cn } from "@workspace/ui/lib/utils";


const inter = Inter({subsets:['latin'],variable:'--font-sans'})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, "font-sans", inter.variable)}
    >
      <body>
        <ClerkProvider>
          <Provider>
              <ThemeProvider>{children}</ThemeProvider>
          </Provider>
        </ClerkProvider>
      </body>
    </html>
  )
}
