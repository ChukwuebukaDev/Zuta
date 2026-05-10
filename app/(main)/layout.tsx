
import Footer from "@/components/ui/Home/Footer";
export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>

    {/* <Header />  */}

      <main className="min-h-screen">
        {children}
      </main>

      <Footer />
    </>
  );
}