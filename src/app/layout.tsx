import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "PitchDeck AI — Generate Investor-Ready Pitch Decks",
  description:
    "AI-powered pitch deck generator. Create compelling 10-slide decks, investor emails, elevator pitches, competition matrices, and financial projections.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("pitchdeck-theme")||"dark";var r=t==="system"?window.matchMedia("(prefers-color-scheme:dark)").matches?"dark":"light":t;document.documentElement.setAttribute("data-theme",r);if(r==="light"){document.documentElement.style.setProperty("--pd-bg","#f8f8f8");document.documentElement.style.setProperty("--pd-text","#0a0a0a");document.documentElement.style.setProperty("--pd-bg-card","#ffffff");document.documentElement.style.setProperty("--pd-border","rgba(0,0,0,0.1)");document.documentElement.style.setProperty("--pd-surface","rgba(0,0,0,0.03)");document.documentElement.style.setProperty("--pd-text-secondary","#525252");document.documentElement.style.setProperty("--pd-text-muted","#737373");document.documentElement.style.setProperty("--pd-bg-hover","#f0f0f0")}}catch(e){}})()`,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0a0a0a] text-white`}
      >
        {children}
      </body>
    </html>
  );
}
