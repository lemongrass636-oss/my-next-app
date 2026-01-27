import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-slate-900 text-white p-4 shadow-md">
      <nav className="max-w-4xl mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">My Next.js App</h1>
        <ul className="flex gap-6">
          <li>
            <Link href="/" className="hover:text-blue-400 transition-colors">
              Home
            </Link>
          </li>
          <li>
            <Link href="/about" className="hover:text-blue-400 transition-colors">
              About
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}