import type { Metadata } from "next";
import { IBM_Plex_Sans, Inter } from "next/font/google";
import "./_styles/globals.css";
import "./_styles/tailwind.css";

import {
  SplashProvider,
  TerminalAuthGuard,
  InitialWalkthroughProvider,
} from "./_providers";

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
      <body
        className={`${ibmPlexSans.variable} ${inter.variable} antialiased min-h-screen h-full`}
      >
        <SplashProvider>
          <TerminalAuthGuard>
            <InitialWalkthroughProvider>{children}</InitialWalkthroughProvider>
          </TerminalAuthGuard>
        </SplashProvider>
      </body>
    </html>
  );
}
