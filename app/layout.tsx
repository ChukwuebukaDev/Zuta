import "./globals.css";
import { Toaster } from "sonner";
import {Inter} from "next/font/google";
import Providers from "./Providers";
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
    <html lang="en">
      <body className={inter.className + " bg-gray-100 min-h-screen flex flex-col"}>
        <Providers>
          <main className="flex-1">{children}</main>
          <Toaster position="top-center" richColors />
        </Providers>
      </body>
    </html>
  );
}
