import ModalInput from "@/components/ModalInput";
import { IoIosCloseCircle } from "react-icons/io";

export default function ChangePasswordModal({ setShowChangePasswordModal, handleChangePassword }) {
    return (
    <div className='modal'>
        <form onSubmit={handleChangePassword} className="modalForm h-32 bg-white px-4 rounded-lg w-220 mx-auto" >
            <div className="close_button_container">
              <button type="button" onClick={() => setShowChangePasswordModal(0)} aria-label="Close change password dialog">
                <IoIosCloseCircle className="text-2xl text-gray-600"/>
              </button>
            </div>
            <h3>Please re-enter account details to delete account</h3>
            <section className="flex justify-around mt-4">
              <ModalInput value="Email"/>
              <ModalInput value="Old Password" type="password"/>
              <ModalInput value="New Password" type="password"/>
              <input type="submit" className="border-2 bg-yellow-600 hover:bg-yellow-800 text-white font-bold py-2 px-4 rounded transition-colors duration-150" value="Change Password" />
            </section>
        </form>
        </div>
    );
}