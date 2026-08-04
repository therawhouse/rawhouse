import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { User, Package, MapPin, LogOut } from "lucide-react";

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();
  
  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-raw-bg pt-24 pb-12">
      <div className="max-w-6xl mx-auto px-4 md:px-8 flex flex-col md:flex-row gap-8">
        
        {/* Sidebar */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="bg-raw-card border border-raw-border p-6 space-y-6 rounded-sm sticky top-32">
            <div>
              <h2 className="text-xl font-serif-luxury text-raw-ivory tracking-widest uppercase">
                My Account
              </h2>
              <p className="text-xs text-raw-muted mt-1">{session.user.email}</p>
            </div>
            
            <nav className="space-y-1">
              <Link href="/account" className="flex items-center space-x-3 text-sm p-3 rounded-md hover:bg-raw-charcoal hover:text-raw-gold transition-colors text-raw-ivory">
                <User className="w-4 h-4" />
                <span className="uppercase tracking-widest text-[11px] font-bold">Profile Details</span>
              </Link>
              <Link href="/account/orders" className="flex items-center space-x-3 text-sm p-3 rounded-md hover:bg-raw-charcoal hover:text-raw-gold transition-colors text-raw-ivory">
                <Package className="w-4 h-4" />
                <span className="uppercase tracking-widest text-[11px] font-bold">Order History</span>
              </Link>
              <Link href="/account/addresses" className="flex items-center space-x-3 text-sm p-3 rounded-md hover:bg-raw-charcoal hover:text-raw-gold transition-colors text-raw-ivory">
                <MapPin className="w-4 h-4" />
                <span className="uppercase tracking-widest text-[11px] font-bold">Address Book</span>
              </Link>
            </nav>

            <div className="pt-4 border-t border-raw-border">
              <Link href="/api/auth/signout" className="flex items-center space-x-3 text-sm p-3 rounded-md hover:bg-raw-charcoal hover:text-red-400 transition-colors text-raw-muted">
                <LogOut className="w-4 h-4" />
                <span className="uppercase tracking-widest text-[11px] font-bold">Log Out</span>
              </Link>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
