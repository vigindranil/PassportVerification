import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Header() {
  return (
    (<header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-blue-600">
          Passport Verification Portal
        </Link>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link href="#features" className="text-gray-600 hover:text-blue-600">
                Services
              </Link>
            </li>
            <li>
              <Link href="#" className="text-gray-600 hover:text-blue-600">
                About
              </Link>
            </li>
            <li>
              <Link href="#" className="text-gray-600 hover:text-blue-600">
                Contact
              </Link>
            </li>
          </ul>
        </nav>
        {/* <Link className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg" href="/login">Authority Login</Link> */}
      </div>
    </header>)
  );
}

