"use client";
import useAuth from "@/hooks/useAuth";

export default function UserPage() {
  const { currentUser, logout } = useAuth() || {};

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Welcome {currentUser?.firstName} {currentUser?.lastName}</h1>
      <div>
        <h2 className="text-xl font-medium">Role: {currentUser?.role || 'User'}</h2>
      </div>
      <p className="text-gray-600 dark:text-gray-200">This is your user page.</p>
      <button
        onClick={logout}
        className="px-4 py-2 rounded bg-cyan-600 text-white hover:bg-cyan-500 focus:outline-none"
      >
        Logout
      </button>
    </main>
  );
}