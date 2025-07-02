"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaHome,
  FaBars,
  FaFileAlt,
  FaColumns,
  FaFile,
  FaTags,
  FaCog,
} from "react-icons/fa";
import UserAvatar from "./UserAvatar";
import { MdOutlinePermMedia } from "react-icons/md";
interface SideBarProps {
  children: React.ReactNode;
}

interface MenuItem {
  label: string;
  href: string;
  icon: JSX.Element;
}

const SideBar: React.FC<SideBarProps> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const menuItems: MenuItem[] = [
    {
      label: "Dashboard",
      href: "/admin",
      icon: <FaHome className="w-5 h-5" />,
    },
    {
      label: "Navigation",
      href: "/admin/navigation",
      icon: <FaBars className="w-5 h-5" />,
    },
    {
      label: "Pages",
      href: "/admin/pages",
      icon: <FaFileAlt className="w-5 h-5" />,
    },
    {
      label: "Media",
      href: "/admin/media",
      icon: <MdOutlinePermMedia className="w-5 h-5" />,
    },
    {
      label: "Footer",
      href: "/admin/footer",
      icon: <FaColumns className="w-5 h-5" />,
    },
    // products

    {
      label: "Products",
      href: "/admin/products",
      icon: <FaFile className="w-5 h-5" />,
    },
    // {
    //   label: "Orders",
    //   href: "/admin/orders",
    //   icon: <FaTags className="w-5 h-5" />,
    // },
  ];

  const isActive = (href: string) => {
    // Find all matching menu items
    const matches = menuItems.filter(
      (item) =>
        pathname === item.href ||
        (item.href !== "/admin" && pathname.startsWith(`${item.href}/`))
    );
    // If no matches, check for exact match with current href
    if (matches.length === 0) {
      return pathname === href;
    }
    // Return true only if the current href is the longest (most specific) match
    const longestMatch = matches.reduce((a, b) =>
      a.href.length > b.href.length ? a : b
    );
    return longestMatch.href === href;
  };
  console.log("pathname", pathname);
  if (pathname.startsWith("/admin/pages/edit/")) {
    return <>{children}</>;
  } else
    return (
      <>
        <nav className="fixed top-0 z-50 w-full border-b bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
          <div className="px-3 py-3 lg:px-5 lg:pl-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center justify-start rtl:justify-end">
                <Link href="/admin" className="flex ms-2 md:me-24">
                  <img
                    src="/logo-placeholder-image.png"
                    className="h-12 me-3"
                    alt="Logo"
                  />
                </Link>
              </div>
              <div className="flex items-center">
                <div className="flex gap-2 items-center ms-3">
                  <UserAvatar />
                  <button
                    onClick={toggleMobileMenu}
                    data-drawer-target="logo-sidebar"
                    data-drawer-toggle="logo-sidebar"
                    aria-controls="logo-sidebar"
                    type="button"
                    className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-blue-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-600 transition-colors duration-200"
                    aria-expanded={isMobileMenuOpen}
                  >
                    <span className="sr-only">Open sidebar</span>
                    <FaBars className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </nav>

        <aside
          id="logo-sidebar"
          className={`fixed top-0 left-0 z-40 w-52 h-screen pt-20 transition-transform ${
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          } bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 sm:translate-x-0`}
          aria-label="Sidebar"
        >
          <div className="h-full px-3 pb-4 overflow-y-auto overflow-x-hidden">
            <ul className="space-y-2 font-medium">
              {menuItems.map((item, index) => (
                <li key={`sidebar-item-${index}`}>
                  <Link
                    href={item.href}
                    className={`flex items-center p-2 rounded-lg transition-colors duration-200 ${
                      isActive(item.href)
                        ? "bg-blue-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                        : "text-gray-700 dark:text-gray-200 hover:bg-blue-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    <span
                      className={`transition-colors duration-200 ${
                        isActive(item.href)
                          ? "text-gray-900 dark:text-white"
                          : "text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                      }`}
                    >
                      {item.icon}
                    </span>
                    <span className="flex-1 ms-3 whitespace-nowrap">
                      {item.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <div className="flex flex-col sm:pl-56 pt-20 px-4 sm:px-6 lg:px-8 lg:pl-56 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-200">
          {children}
        </div>
      </>
    );
};

export default SideBar;
