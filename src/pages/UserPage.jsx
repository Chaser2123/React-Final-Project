"use client";
import React from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";

import ChangePasswordModal from "@/components/modals/ChangePasswordModal.jsx";
import DeleteAccountModal from "@/components/modals/DeleteAccountModal.jsx";

export default function UserPage() {

  const { currentUser, logout, deleteAccount, requestRoleChange } = useAuth() || {};
  const [showDeleteAccountModal, setShowDeleteAccountModal] = React.useState(0);
  const [showChangePasswordModal, setShowChangePasswordModal] = React.useState(0);
  const [requestedRole, setRequestedRole] = React.useState("");
  const router = useRouter();

  const handleDeleteAccount = async (event) => {
    event.preventDefault();
    const email = event.target.querySelector('input[id="Email"]').value;
    const password = event.target.querySelector('input[id="Password"]').value;
    deleteAccount({email,password,currentUser,setShowDeleteAccountModal,router});
    changePassword({currentUser,router,setShowChangePasswordModal});
  };
  const [pendingRoleRequest, setPendingRoleRequest] = React.useState(false);
  const handleRoleChangeRequest = async (event) => {
    event.preventDefault();
    await requestRoleChange({ currentUser, requestedRole });
    setPendingRoleRequest(true);
  };
  return (
    <main className="w-full min-h-screen flex flex-col justify-start items-center fixed bg-image bg-cover bg-center bg-[url('@/images/chicago.jpg')]">
      {showDeleteAccountModal === 1 && (
        <DeleteAccountModal setShowDeleteAccountModal={setShowDeleteAccountModal} handleDeleteAccount={handleDeleteAccount}/>
      )}
      {
        showChangePasswordModal === 1 && (
          <ChangePasswordModal setShowChangePasswordModal={setShowChangePasswordModal} currentUser={currentUser} />
        )
      }
      <div className="p-6 space-y-4 bg-white/90 rounded-2xl border-4 border-purple-700 shadow-md w-220 mx-auto mt-10">
        <h1 className="text-2xl font-semibold">Welcome, {((currentUser?.firstName || '') + ' ' + (currentUser?.lastName || '')).trim() || 'User'}</h1>
        <div>Date Joined: {currentUser?.creationTime ? new Date(currentUser.creationTime).toLocaleDateString() : 'N/A'}</div>
        <div>Last Logged in: {currentUser?.lastSignInTime ? new Date(currentUser.lastSignInTime).toLocaleDateString() : 'N/A'}</div>
        <div className="flex justify-between">
          <h2 className="text-xl font-medium">Role: <span className="uppercase">{currentUser?.role || 'User'}</span></h2>
          {!pendingRoleRequest ? (
            <form onSubmit={handleRoleChangeRequest}>
              <label>Request Role Change</label>
              <select
                value={requestedRole}
                onChange={(e) => setRequestedRole(e.target.value)}
                className="ml-2 p-1 border bg-white border-gray-300 rounded"
              >
                <option value="">Select Role</option>
                <option value="admin">Admin</option>
                <option value="moderator">Moderator</option>
                <option value="editor">Editor</option>
                <option value="contributor">Contributor</option>
              </select>
              <button type="submit" className="ml-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-500">Submit</button>
            </form>
          ) : (
            <div className="text-yellow-600 font-semibold">Role change to <span className="uppercase">{requestedRole}</span> request pending. An admin will review your request.</div>
          )}
        </div>
        <p>This is your user page.</p>
        <div className="space-x-4">
          <button onClick={logout} className="px-4 py-2 rounded bg-cyan-600 text-white hover:bg-cyan-500 focus:outline-none">Logout</button>
          <button onClick={() => setShowDeleteAccountModal(1)} className="px-4 py-2 rounded bg-rose-600 text-white hover:bg-rose-500 focus:outline-none">Delete Account</button>
          <button onClick={() => setShowChangePasswordModal(1)} className="px-4 py-2 rounded bg-yellow-600 text-white hover:bg-yellow-500 focus:outline-none">Change Password</button>
        </div>
      </div>
    </main>
  );
}