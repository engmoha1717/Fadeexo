"use client";

import Link from "next/link";
import { useUser, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface MobileMenuProps {
  isOpen: boolean;
  navigation: Array<{ name: string; href: string }>;
  onClose: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSearch: (e: React.FormEvent) => void;
  isAdminOrEditor?: boolean;
}

export function MobileMenu({ 
  isOpen, 
  navigation, 
  onClose, 
  searchQuery, 
  setSearchQuery, 
  onSearch, 
  isAdminOrEditor = false
}: MobileMenuProps) {
  const { isSignedIn } = useUser();

  if (!isOpen) return null;

  return (
    <div className="md:hidden">
      <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
        {/* Search */}
        <form onSubmit={onSearch} className="mb-4">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search news..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </form>

        {/* Navigation Links */}
        {navigation.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            onClick={onClose}
            className="text-gray-700 hover:text-blue-600 block px-3 py-2 text-base font-medium transition-colors"
          >
            {item.name}
          </Link>
        ))} 

        {/* User Actions */}
        <div className="pt-4 border-t border-gray-200">
          {isSignedIn ? (
            <div className="flex items-center justify-between">
              {isAdminOrEditor && (
                <Link href="/admin/dashboard" onClick={onClose}>
                  <Button variant="outline" size="sm">
                    Admin
                  </Button>
                </Link>
              )}
              <UserButton afterSignOutUrl="/" />
            </div>
          ) : (
            null
            // <div className="flex space-x-2">
            //   <Link href="/sign-in" className="flex-1" onClick={onClose}>
            //     <Button variant="outline" size="sm" className="w-full">
            //       Sign In
            //     </Button>
            //   </Link>
            //   <Link href="/sign-up" className="flex-1" onClick={onClose}>
            //     <Button size="sm" className="w-full">
            //       Sign Up
            //     </Button>
            //   </Link>
            // </div>
          )}
        </div>
      </div>
    </div>
  );
}




















