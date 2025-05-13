import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserRole } from "@shared/schema";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";
import {
  Recycle,
  Truck,
  Store,
  LayoutDashboard,
  ClipboardList,
  ArrowLeftRight,
  Settings,
  LogOut,
  User,
  HelpCircle,
} from "lucide-react";

interface SidebarProps {
  className?: string;
}

export default function DashboardSidebar({ className }: SidebarProps) {
  const [location] = useLocation();
  const { user, logout } = useAuth();

  if (!user) return null;

  // Get the appropriate icon and color based on user role
  const getRoleIcon = () => {
    switch (user.role) {
      case UserRole.COLLECTOR:
        return <Recycle className="h-6 w-6" />;
      case UserRole.TRANSPORTER:
        return <Truck className="h-6 w-6" />;
      case UserRole.BUYER:
        return <Store className="h-6 w-6" />;
      default:
        return <User className="h-6 w-6" />;
    }
  };

  const navItems = [
    {
      title: "Dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
      href: "/dashboard",
    },
    {
      title: "Listings",
      icon: <ClipboardList className="h-5 w-5" />,
      href: "/dashboard/listings",
    },
    {
      title: "Transactions",
      icon: <ArrowLeftRight className="h-5 w-5" />,
      href: "/dashboard/transactions",
    },
    {
      title: "Profile",
      icon: <User className="h-5 w-5" />,
      href: "/dashboard/profile",
    },
    {
      title: "Settings",
      icon: <Settings className="h-5 w-5" />,
      href: "/dashboard/settings",
    }
  ];

  return (
    <aside className={cn("pb-12 text-sidebar-foreground bg-sidebar", className)}>
      <div className="py-4 border-b border-sidebar-border">
        <div className="px-4 flex items-center justify-center">
          <Link href="/" className="flex items-center gap-2">
            {getRoleIcon()}
            <span className="text-xl font-bold">RecycleConnect</span>
          </Link>
        </div>
      </div>
      <div className="py-4 border-b border-sidebar-border px-4">
        <div className="flex items-center gap-2">
          <div className="rounded-full bg-sidebar-accent h-10 w-10 flex items-center justify-center text-sidebar-accent-foreground font-bold">
            {user.fullName?.charAt(0) || user.username.charAt(0)}
          </div>
          <div>
            <p className="font-semibold truncate">{user.fullName || user.username}</p>
            <p className="text-sm capitalize">{user.role}</p>
          </div>
        </div>
      </div>
      <ScrollArea className="h-[calc(100vh-12rem)] px-2 py-4">
        <div className="space-y-1">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  location === item.href && "bg-sidebar-accent text-sidebar-accent-foreground"
                )}
              >
                {item.icon}
                <span className="ml-2">{item.title}</span>
              </Button>
            </Link>
          ))}
        </div>
      </ScrollArea>
      <div className="px-2 pt-2 border-t border-sidebar-border">
        <Button
          variant="ghost"
          className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          onClick={() => logout()}
        >
          <LogOut className="h-5 w-5" />
          <span className="ml-2">Logout</span>
        </Button>
        <Link href="/help">
          <Button
            variant="ghost"
            className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            <HelpCircle className="h-5 w-5" />
            <span className="ml-2">Help</span>
          </Button>
        </Link>
      </div>
    </aside>
  );
}
