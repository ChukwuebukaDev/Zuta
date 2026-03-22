import Link from "next/link";
export function AuthButtons() {
  return (
    <div className="flex items-center gap-3">
      <button className="px-5 py-2 rounded-lg border border-gray-300 text-sm font-medium hover:bg-gray-100 transition">
        <Link href="/auth">Login</Link>
      </button>

      <button className="px-5 py-2 rounded-lg bg-black text-white text-sm font-medium hover:opacity-90 transition">
        <Link href="/auth">Sign Up</Link>
      </button>
    </div>
  );
}
