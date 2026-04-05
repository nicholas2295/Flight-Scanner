import Link from "next/link";
import { Plane } from "lucide-react";

export function Header() {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Plane className="h-5 w-5" />
          Hang Ban Scanner
        </Link>
      </div>
    </header>
  );
}
