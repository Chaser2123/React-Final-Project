import ModalInput from "@/components/ModalInput";
import { IoIosCloseCircle } from "react-icons/io";

export default function DeleteAccountModal({ setShowDeleteAccountModal, handleDeleteAccount }) {
    return (
    <div className='modal'>
        <form onSubmit={handleDeleteAccount} className="modalForm h-32 bg-white px-4 rounded-lg w-[40%] mx-auto" >
            <div className="close_button_container">
              <button type="button" onClick={() => setShowDeleteAccountModal(0)} aria-label="Close delete account dialog">
                <IoIosCloseCircle className="text-2xl text-gray-600"/>
              </button>
            </div>
            <h3>Please re-enter account details to delete account</h3>
            <section className="flex justify-around mt-4">
              <ModalInput value="Email"/>
              <ModalInput value="Password" type="password"/>
              <input type="submit" className="border-2 bg-red-600 hover:bg-red-800 text-white font-bold py-2 px-4 rounded transition-colors duration-150" value="Remove Account" />
            </section>
        </form>
        </div>
    );
}