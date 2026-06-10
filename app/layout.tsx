import "./globals.css";
import { Toaster } from "sonner";
import {Inter, Geist } from "next/font/google";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "@/app/api/uploadthing/core";
import { ClerkProvider } from "@clerk/nextjs";
import { cn } from "@/lib/utils";


const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({ subsets: ["latin"] });
export const metadata = {
  title: {
    default: "Zuta – Buy & Sell Cars in Nigeria",
    template: "%s",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (

    <ClerkProvider>
      <html lang="en" className={cn("font-sans", geist.variable)} suppressHydrationWarning>
        <body className={inter.className + " bg-gray-100 min-h-screen flex flex-col"}>
        <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
           <main className="flex-1">{children}</main>
            <Toaster position="top-center" richColors />
          
        </body>
      </html>
    </ClerkProvider>
  );
}
