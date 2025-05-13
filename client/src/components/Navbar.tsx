import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { useAuth } from "@/lib/auth";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();
  const { user, logout } = useAuth();

  const closeSheet = () => setIsOpen(false);

  const navLinks = [
    { name: "How It Works", href: "/#how-it-works" },
    { name: "Features", href: "/#features" },
    { name: "FAQ", href: "/#faq" },
  ];

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-primary-600 font-bold text-2xl">RecycleConnect</span>
            </Link>
          </div>
          
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary-600"
              >
                {link.name}
              </Link>
            ))}
            
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary-600"
                >
                  Dashboard
                </Link>
                <Button 
                  variant="ghost" 
                  onClick={() => logout()}
                  className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary-600"
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" className="px-3 py-2 text-sm font-medium">
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="ml-2 px-4 py-2 text-sm font-medium">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
          
          <div className="flex items-center sm:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <nav className="flex flex-col gap-4 mt-8">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={closeSheet}
                      className="px-3 py-2 text-lg font-medium text-gray-700 hover:text-primary-600"
                    >
                      {link.name}
                    </Link>
                  ))}
                  
                  {user ? (
                    <>
                      <Link
                        href="/dashboard"
                        onClick={closeSheet}
                        className="px-3 py-2 text-lg font-medium text-gray-700 hover:text-primary-600"
                      >
                        Dashboard
                      </Link>
                      <Button 
                        variant="ghost" 
                        onClick={() => {
                          logout();
                          closeSheet();
                        }}
                        className="px-3 py-2 text-lg font-medium text-gray-700 hover:text-primary-600 justify-start"
                      >
                        Logout
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link href="/login" onClick={closeSheet}>
                        <Button variant="ghost" className="px-3 py-2 text-lg font-medium w-full justify-start">
                          Login
                        </Button>
                      </Link>
                      <Link href="/register" onClick={closeSheet}>
                        <Button className="px-4 py-2 text-lg font-medium w-full justify-start">
                          Sign Up
                        </Button>
                      </Link>
                    </>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
