"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserButton, useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Menu, Search, X } from "lucide-react";
import { MobileMenu } from "./mobile-menu";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const { isSignedIn, user } = useUser();
  
  // Get user role from Convex database
  const userData = useQuery(
    api.users.getUserByClerkId, 
    isSignedIn && user?.id ? { clerkId: user.id } : "skip"
  );
  
  // Check if user is admin or editor
  const isAdminOrEditor = userData?.role === "admin" || userData?.role === "editor";

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Politics", href: "/categories/politics" },
    { name: "Sports", href: "/categories/sports" },
    // { name: "Health", href: "/categories/health" },
    { name: "contact", href: "/contact" },
    // { name: "Entertainment", href: "/categories/entertainment" },
  ];

  return (
    <header className="bg-white shadow-lg border-b border-gray-200">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-blue-600">FADEEXO</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Search and User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <form onSubmit={handleSearch} className="flex items-center">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search news..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </form>

            {isSignedIn ? (
              <div className="flex items-center space-x-4">
                {isAdminOrEditor && (
                  <Link href="/admin/dashboard">
                    <Button variant="outline" size="sm">
                      Admin
                    </Button>
                  </Link>
                )}
                <UserButton afterSignOutUrl="/" />
              </div>
            ) : (
              null
              // <div className="flex items-center space-x-2">
              //   <Link href="/sign-in">
              //     <Button variant="outline" size="sm">
              //       Sign In
              //     </Button>
              //   </Link>
              //   <Link href="/sign-up">
              //     <Button size="sm">
              //       Sign Up
              //     </Button>
              //   </Link>
              // </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              {isMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <MobileMenu 
          isOpen={isMenuOpen} 
          navigation={navigation}
          onClose={() => setIsMenuOpen(false)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onSearch={handleSearch}
          isAdminOrEditor={isAdminOrEditor}
        />
      </nav>
    </header>
  );
}































// "use client";

// import { useState } from "react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { UserButton, useUser } from "@clerk/nextjs";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Menu, Search, X } from "lucide-react";
// import { MobileMenu } from "./mobile-menu";

// export function Header() {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const router = useRouter();
//   const { isSignedIn } = useUser();

//   const handleSearch = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (searchQuery.trim()) {
//       router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
//       setSearchQuery("");
//     }
//   };

//   const navigation = [
//     { name: "Home", href: "/" },
//     { name: "Politics", href: "/categories/politics" },
//     { name: "Sports", href: "/categories/sports" },
//     { name: "Health", href: "/categories/health" },
//     { name: "Technology", href: "/categories/technology" },
//     { name: "Entertainment", href: "/categories/entertainment" },
//   ];

//   return (
//     <header className="bg-white shadow-lg border-b border-gray-200">
//       <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between items-center h-16">
//           {/* Logo */}
//           <div className="flex-shrink-0">
//             <Link href="/" className="flex items-center">
//               <span className="text-2xl font-bold text-blue-600">Daily News</span>
//             </Link>
//           </div>

//           {/* Desktop Navigation */}
//           <div className="hidden md:block">
//             <div className="ml-10 flex items-baseline space-x-8">
//               {navigation.map((item) => (
//                 <Link
//                   key={item.name}
//                   href={item.href}
//                   className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
//                 >
//                   {item.name}
//                 </Link>
//               ))}
//             </div>
//           </div>

//           {/* Search and User Actions */}
//           <div className="hidden md:flex items-center space-x-4">
//             <form onSubmit={handleSearch} className="flex items-center">
//               <div className="relative">
//                 <Input
//                   type="text"
//                   placeholder="Search news..."
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 />
//                 <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
//               </div>
//             </form>

//             {isSignedIn ? (
//               <div className="flex items-center space-x-4">
//                 <Link href="/admin/dashboard">
//                   <Button variant="outline" size="sm">
//                     Admin
//                   </Button>
//                 </Link>
//                 <UserButton afterSignOutUrl="/" />
//               </div>
//             ) : (
//               <div className="flex items-center space-x-2">
//                 <Link href="/sign-in">
//                   <Button variant="outline" size="sm">
//                     Sign In
//                   </Button>
//                 </Link>
//                 <Link href="/sign-up">
//                   <Button size="sm">
//                     Sign Up
//                   </Button>
//                 </Link>
//               </div>
//             )}
//           </div>

//           {/* Mobile menu button */}
//           <div className="md:hidden">
//             <button
//               onClick={() => setIsMenuOpen(!isMenuOpen)}
//               className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
//             >
//               {isMenuOpen ? (
//                 <X className="block h-6 w-6" />
//               ) : (
//                 <Menu className="block h-6 w-6" />
//               )}
//             </button>
//           </div>
//         </div>

//         {/* Mobile Menu */}
//         <MobileMenu 
//           isOpen={isMenuOpen} 
//           navigation={navigation}
//           onClose={() => setIsMenuOpen(false)}
//           searchQuery={searchQuery}
//           setSearchQuery={setSearchQuery}
//           onSearch={handleSearch}
//         />
//       </nav>
//     </header>
//   );
// }