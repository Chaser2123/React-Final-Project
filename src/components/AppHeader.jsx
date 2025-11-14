"use client";
import Link from "next/link";
import useAuth from "@/hooks/useAuth";
import { HiTicket } from "react-icons/hi2";
import { FaHome, FaUserCircle } from "react-icons/fa";
import { usePathname } from "next/navigation";

export default function AppHeader() {
  const headerStyles = 'inline-flex items-center gap-2';
  const pageUnderline = 'underline underline-offset-5 decoration-4';
  const { isAuthorized, currentUser } = useAuth() || {};
  const welcomeName = typeof currentUser === 'string'
    ? (currentUser === 'guest' ? null : currentUser)
    : (currentUser?.firstName || currentUser?.name || currentUser?.role || null);

  const pathname = usePathname();
  const isActive = (href, { exact = false } = {}) => {
    if (href === "/") return pathname === "/"; // root must be exact
    return exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <header className="p-4 flex flex-nowrap justify-between bg-gray-200 dark:bg-cyan-700">
      <Link href="/" className="font-bold text-lg">Flight Booker</Link>
      <div className="flex gap-5 items-center">
        <Link href="/" className={`${headerStyles} ${isActive("/", { exact: true }) ? pageUnderline : ''}`}><FaHome className="text-3xl" /><span>Home</span></Link>
        <Link href="/bookflight" className={`${headerStyles} ${isActive("/bookflight") ? pageUnderline : ''}`}><HiTicket className="text-3xl" /><span>Book A Flight</span></Link>
        {isAuthorized && welcomeName ? (
          <Link href="/userpage" className={`${headerStyles} ${isActive("/userpage") ? pageUnderline : ''}`}>
            <FaUserCircle className="text-3xl" />
            <span>{`Welcome, ${welcomeName}`}</span>
          </Link>
        ) : (
          <Link href="/loginpage" className={`${headerStyles} ${isActive("/loginpage") ? pageUnderline : ''}`}>
            <FaUserCircle className="text-3xl" />
            <span>Login / Sign Up</span>
          </Link>
        )}
      </div>
    </header>
  );
}
