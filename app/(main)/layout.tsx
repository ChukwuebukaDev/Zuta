// import Header from "@/components/UI/Home/Header";
import Footer from "@/components/UI/Home/Footer";
export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
  {/* Header handled by Hero section */}
    {/* <Header />  */}

      <main className="min-h-screen">
        {children}
      </main>

      <Footer />
    </>
  );
}