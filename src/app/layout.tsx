import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Toaster } from "@/components/ui/toaster";
import UserComponent from "@/components/UserComponent";

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
  title: "Git Tracker",
  description: "The next gen knowledge aggregator",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  //here fetch the details of
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <UserComponent/>
        <SidebarProvider defaultOpen={false}>
          
          <AppSidebar />
          
          <main className="w-full bg-black text-white" >
            <SidebarTrigger />

            {children}

          </main>
        </SidebarProvider>
        <Toaster />

      </body>
    </html>
  );
}
