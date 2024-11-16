import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="flex-grow relative z-10">{children}</main>
      <Footer />
    </>
  );
}