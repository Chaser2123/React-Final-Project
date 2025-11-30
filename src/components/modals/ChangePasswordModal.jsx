
import ModalInput from "@/components/ModalInput";
import { IoIosCloseCircle } from "react-icons/io";
import useAuth from "@/hooks/useAuth";
import { useState } from "react";

export default function ChangePasswordModal({ setShowChangePasswordModal, currentUser }) {
  const { changePassword } = useAuth();
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await changePassword({email,oldPassword,newPassword,confirmNewPassword,currentUser,setShowChangePasswordModal});
  };

  return (
    <div className='modal'>
      <form onSubmit={handleSubmit} className="modalForm bg-white px-4 py-6 rounded-lg w-7/12 mx-auto" >
        <div className="close_button_container">
          <button type="button" onClick={() => setShowChangePasswordModal(0)} aria-label="Close change password dialog">
            <IoIosCloseCircle className="text-2xl text-gray-600"/>
          </button>
        </div>
        <h3 className="mb-4 text-lg">Change your password</h3>
        <section className="flex flex-col gap-6 md:flex-row md:items-center">
          <div className="flex flex-col flex-1">
            <label className="mb-2 font-medium">Email</label>
            <ModalInput value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
          </div>
          <div className="flex flex-col flex-1">
            <label className="mb-2 font-medium">Old Password</label>
            <ModalInput value={oldPassword} onChange={e => setOldPassword(e.target.value)} type="password" placeholder="Old Password" />
          </div>
          <div className="flex flex-col flex-1">
            <label className="mb-2 font-medium">New Password</label>
            <ModalInput value={newPassword} onChange={e => setNewPassword(e.target.value)} type="password" placeholder="New Password" />
          </div>
          <div className="flex flex-col flex-1">
            <label className="mb-2 font-medium">Confirm New Password</label>
            <ModalInput value={confirmNewPassword} onChange={e => setConfirmNewPassword(e.target.value)} type="password" placeholder="Confirm New Password" />
          </div>
          <input type="submit" className="bg-yellow-600 hover:bg-yellow-800 text-white font-bold py-2 px-6 rounded transition-colors duration-150 ml-4" value="Change Password" />
        </section>
      </form>
    </div>
  );
}