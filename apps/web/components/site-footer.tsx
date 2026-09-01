import Link from "next/link";
import { Shield } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const LINKS = [
  {
    heading: "Platform",
    items: [
      { href: "/browse", label: "Browse found" },
      { href: "/report", label: "Report a document" },
      { href: "/my-reports", label: "My reports" },
    ],
  },
  {
    heading: "Documents",
    items: [
      { href: "/browse", label: "National IDs" },
      { href: "/browse", label: "Driver's licences" },
      { href: "/browse", label: "Passports" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="relative mt-24 border-t bg-gradient-subtle">
      <div className="container mx-auto px-4 py-14">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <Link href="/" className="inline-flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-brand">
                <Shield className="h-4 w-4 text-white" />
              </span>
              <span className="text-lg font-bold tracking-tight">Wanai</span>
            </Link>
            <p className="mt-4 max-w-sm text-sm text-muted-foreground">
              Helping Zimbabweans reunite with lost national IDs, licences and passports —
              without the queues.
            </p>
          </div>

          {LINKS.map((column) => (
            <div key={column.heading}>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {column.heading}
              </h3>
              <ul className="mt-4 space-y-3 text-sm">
                {column.items.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col items-center justify-between gap-3 text-xs text-muted-foreground sm:flex-row">
          <p>&copy; {new Date().getFullYear()} Wanai. Built for Zimbabwe.</p>
          <p>Never share full document numbers publicly.</p>
        </div>
      </div>
    </footer>
  );
}
