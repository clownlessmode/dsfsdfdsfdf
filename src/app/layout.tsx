import type { Metadata } from "next";
import { IBM_Plex_Sans } from "next/font/google";
import "./_styles/globals.css";
import "./_styles/tailwind.css";

import { QueryProvider, SplashProvider, TerminalAuthGuard } from "./_providers";

const geistSans = IBM_Plex_Sans({
  variable: "--font-geist-sans",
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
        {/* <SplashProvider> */}
        <body
          className={`${geistSans.className} antialiased min-h-screen h-full`}
        >
          {/* <TerminalAuthGuard>{children}</TerminalAuthGuard> */}
          {children}
        </body>
        {/* </SplashProvider> */}
      </QueryProvider>
    </html>
  );
}
