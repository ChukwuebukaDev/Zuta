import "./globals.css";
import Header from "@/components/UI/Home/Header";
import Footer from "@/components/UI/Home/Footer";

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
      <body className="bg-gray-100 min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
   
      </body>
    </html>
  );
}
