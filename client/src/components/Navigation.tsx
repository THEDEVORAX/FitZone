import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";
import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navigation() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();

  const isActive = (path: string) => location === path;

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "About", path: "/about" },
    { label: "Classes", path: "/classes" },
    { label: "Trainers", path: "/trainers" },
    { label: "Subscriptions", path: "/subscriptions" },
    { label: "Blog", path: "/blog" },
    { label: "Success Stories", path: "/success-stories" },
  ];

  return (
    <nav className="bg-black text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/">
            <span className="text-2xl font-bold text-red-600 hover:text-red-500 cursor-pointer">
              FitZone
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link key={link.path} href={link.path}>
                <span
                  className={`cursor-pointer transition-colors ${
                    isActive(link.path)
                      ? "text-red-600 font-semibold"
                      : "text-gray-300 hover:text-white"
                  }`}
                >
                  {link.label}
                </span>
              </Link>
            ))}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <Link href="/dashboard">
                  <span className="text-gray-300 hover:text-white transition-colors cursor-pointer">
                    Dashboard
                  </span>
                </Link>
                {user.role === "admin" && (
                  <Link href="/admin">
                    <span className="text-gray-300 hover:text-white transition-colors cursor-pointer">
                      Admin
                    </span>
                  </Link>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => logout()}
                  className="text-red-600 border-red-600 hover:bg-red-600 hover:text-white"
                >
                  Logout
                </Button>
              </>
            ) : (
              <Button
                size="sm"
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={() => (window.location.href = getLoginUrl())}
              >
                Login
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden mt-4 space-y-2">
            {navLinks.map((link) => (
              <Link key={link.path} href={link.path}>
                <span
                  className={`block py-2 px-4 rounded cursor-pointer transition-colors ${
                    isActive(link.path)
                      ? "bg-red-600 text-white"
                      : "text-gray-300 hover:bg-gray-800"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </span>
              </Link>
            ))}
            <div className="pt-4 border-t border-gray-700 space-y-2">
              {user ? (
                <>
                  <Link href="/dashboard">
                    <span
                      className="block py-2 px-4 text-gray-300 hover:bg-gray-800 rounded cursor-pointer transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      Dashboard
                    </span>
                  </Link>
                  {user.role === "admin" && (
                    <Link href="/admin">
                      <span
                        className="block py-2 px-4 text-gray-300 hover:bg-gray-800 rounded cursor-pointer transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        Admin
                      </span>
                    </Link>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    className="w-full text-red-600 border-red-600 hover:bg-red-600 hover:text-white"
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <Button
                  size="sm"
                  className="w-full bg-red-600 hover:bg-red-700 text-white"
                  onClick={() => {
                    window.location.href = getLoginUrl();
                    setIsOpen(false);
                  }}
                >
                  Login
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
