import Link from "next/link";
import { ADMIN_ROUTES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { logout } from "@/app/actions/auth";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 w-full border-b bg-slate-900 text-white">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href={ADMIN_ROUTES.DASHBOARD} className="font-bold text-xl">
              Admin Panel
            </Link>
            <nav className="flex items-center gap-4">
              <Link href={ADMIN_ROUTES.BLOGS} className="text-sm font-medium hover:text-slate-300">
                Blogs
              </Link>
              <Link href={ADMIN_ROUTES.COMMENTS} className="text-sm font-medium hover:text-slate-300">
                Comments
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm font-medium hover:underline underline-offset-4">
              View Site
            </Link>
            <form action={logout}>
              <Button variant="outline" size="sm" className="bg-transparent text-white border-white hover:bg-white hover:text-slate-900">
                Logout
              </Button>
            </form>
          </div>
        </div>
      </header>
      <main className="flex-1 container py-10">{children}</main>
    </div>
  );
}
