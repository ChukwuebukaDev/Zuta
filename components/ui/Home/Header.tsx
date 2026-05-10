import Link from "next/link";
export default function Header() {
  return (
    <header className="shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between p-4">
        <Link href="/" className="text-3xl font-bold text-white">
          Zuta
        </Link>
      </div>
    </header>
  );
}