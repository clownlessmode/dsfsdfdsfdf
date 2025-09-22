import type { Metadata } from "next";
import { IBM_Plex_Sans, Inter } from "next/font/google";
import "./_styles/globals.css";
import "./_styles/tailwind.css";

import {
  QueryProvider,
  SplashProvider,
  TerminalAuthGuard,
  PreloadProvider,
} from "./_providers";
import { CacheInfo } from "@shared/ui/cache-info";

const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});
export const metadata: Metadata = {
  title: "FOODCORT-TERMINAL",
  description: "FOODCORT-TERMINAL",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full max-w-[1080px] overflow-hidden"
      suppressHydrationWarning
    >
      <QueryProvider>
        <body
          className={`${ibmPlexSans.variable} ${inter.variable} antialiased min-h-screen h-full`}
        >
          <SplashProvider>
            <TerminalAuthGuard>
              <PreloadProvider>
                {children}
                <CacheInfo />
              </PreloadProvider>
            </TerminalAuthGuard>
          </SplashProvider>
        </body>
      </QueryProvider>
    </html>
  );
}
