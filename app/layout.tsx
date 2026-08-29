import "./globals.css";
import { Toaster } from "sonner";
import { Inter, Geist } from "next/font/google";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "@/app/api/uploadthing/core";
import { cn } from "@/lib/utils";
import FloatingNav from "@/components/ui/Wrapper/FloatingNav";
import { createClient } from "@/supabase/server";

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: {
    default: "Zuta – Buy & Sell Cars in Nigeria",
    template: "%s",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();

  const initialUser = authUser
    ? {
        role: (authUser as any).role || "USER",
        isAuthenticated: true,
      }
    : {
        role: null,
        isAuthenticated: false,
      };

  return (
    <html lang="en" className={cn("font-sans", geist.variable)} suppressHydrationWarning>
      <body className={`${inter.className} bg-gray-100 min-h-screen flex flex-col`}>
        {/* Hydrates Uploadthing configurations */}
        <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
        
        {/* ⚡ Pass initial server-side user state to FloatingNav */}
        <FloatingNav initialUser={initialUser} />
        
        <main className="flex-1">{children}</main>
        
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}