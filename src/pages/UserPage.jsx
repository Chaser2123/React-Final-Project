"use client";
import React from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";

import DeleteAccountModal from "@/components/modals/DeleteAccountModal.jsx";

export default function UserPage() {
  const { currentUser, logout, deleteAccount } = useAuth() || {};
  const [showDeleteAccountModal, setShowDeleteAccountModal] = React.useState(0);
  const [showChangePasswordModal, setShowChangePasswordModal] = React.useState(0);
  const router = useRouter();

  const handleDeleteAccount = async (event) => {
    event.preventDefault();
    const email = event.target.querySelector('input[id="Email"]').value;
    const password = event.target.querySelector('input[id="Password"]').value;
    // Use deleteAccount from useAuth (already destructured)
    deleteAccount({email,password,currentUser,setShowDeleteAccountModal,router});
    changePassword({currentUser,router,setShowChangePasswordModal});
  };

  return (
    <main>
      {showDeleteAccountModal === 1 && (
        <DeleteAccountModal setShowDeleteAccountModal={setShowDeleteAccountModal} handleDeleteAccount={handleDeleteAccount}/>
      )}
      {
        showChangePasswordModal === 1 && (
          <ChangePasswordModal setShowChangePasswordModal={setShowChangePasswordModal} />
        )
      }
      <div className="p-6 space-y-4 bg-white rounded-2xl shadow-md max-w-3xl mx-auto mt-10">
        <h1 className="text-2xl font-semibold">Welcome {currentUser?.firstName + ' ' + currentUser?.lastName || 'User'}</h1>
        <div>
          <h2 className="text-xl font-medium">Role: {currentUser?.role || 'User'}</h2>
        </div>
        <p>This is your user page.</p>
        <div>
          <button onClick={logout} className="px-4 py-2 rounded bg-cyan-600 text-white hover:bg-cyan-500 focus:outline-none">Logout</button>
          <button onClick={() => setShowDeleteAccountModal(1)} className="px-4 py-2 rounded bg-rose-600 text-white hover:bg-rose-500 focus:outline-none">Delete Account</button>
        </div>
      </div>
    </main>
  );
}