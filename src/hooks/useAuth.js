import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext.jsx";
import { auth } from "@/lib/firebase";
import { EmailAuthProvider, reauthenticateWithCredential, deleteUser } from "firebase/auth";

export default function useAuth() {
    const context = useContext(AuthContext);

    const deleteAccount = async ({ email, password, currentUser, setShowDeleteAccountModal, router }) => {
        if (!email || !password) {
            alert("Please enter both email and password.");
            return;
        }
        if (email !== currentUser.email) {
            alert("Email does not match the current user's email.");
            return;
        }
        try {
            const user = auth.currentUser;
            if (!user) {
                alert("No user is currently signed in.");
                return;
            }
            const credential = EmailAuthProvider.credential(email, password);
            await reauthenticateWithCredential(user, credential);
            await deleteUser(user);
            setShowDeleteAccountModal(0);
            alert('Account removed successfully!');
            router.replace('/');
        } catch (error) {
            console.error("Error deleting account:", error);
            if (error.code === "auth/wrong-password") {
                alert("Incorrect password.");
            } else if (error.code === "auth/invalid-credential") {
                alert("Invalid credentials. Please try again.");
            } else {
                alert("Failed to delete account. Please try again.");
            }
        }
    };

    return { ...context, deleteAccount };
}