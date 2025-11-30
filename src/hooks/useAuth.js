import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext.jsx";
import { auth } from "@/lib/firebase";
import { EmailAuthProvider, reauthenticateWithCredential, deleteUser } from "firebase/auth";

export default function useAuth() {
    const context = useContext(AuthContext);
    // Shared helper functions
    const ensureFields = (fields) => {
        for (const [key, value] of Object.entries(fields)) {
            if (!value) return `${key} is required.`;
        }
        return null;
    };
    const checkEmail = (email, currentUser) => {
        if (email !== currentUser.email) {
            return "Email does not match the current logged-in user.";
        }
        return null;
    };

    const reauthenticate = async (email, password) => {
        const user = auth.currentUser;
        if (!user) throw new Error("auth/no-current-user");

        const credential = EmailAuthProvider.credential(email, password);
        return await reauthenticateWithCredential(user, credential);
    };

    const handleAuthErrors = (error, context) => {
        console.error(`Error during ${context}:`, error);
        switch (error.code) {
            case "auth/wrong-password":
                alert("Incorrect password.");
                break;
            case "auth/invalid-credential":
                alert("Invalid credentials. Please try again.");
                break;
            case "auth/no-current-user":
                alert("No user is currently signed in.");
                break;
            default:
                alert(`Failed to ${context}. Please try again.`);
        }
    };

    const completeAction = (closeModalFn, msg) => {
        if (closeModalFn) closeModalFn(0);
        alert(msg);
    };
// Change Password functionality
    const changePassword = async ({
        email, oldPassword,newPassword,confirmNewPassword,currentUser,setShowChangePasswordModal
    }) => {
        // Shared validation
        const missing = ensureFields({ email, oldPassword, newPassword, confirmNewPassword });
        if (missing) return alert(missing);

        if (newPassword !== confirmNewPassword)
            return alert("New passwords do not match.");

        const identityError = checkEmail(email, currentUser);
        if (identityError) return alert(identityError);

        try {
            await reauthenticate(email, oldPassword);
            await auth.currentUser.updatePassword(newPassword);
                completeAction(setShowChangePasswordModal, "Password Change Successful!");
        } catch (error) {
            handleAuthErrors(error, "change password");
        }
    
    };
    // Delete Account functionality
    const deleteAccount = async ({
        email,password,currentUser,setShowDeleteAccountModal,router
    }) => {
        // Shared validation
        const missing = ensureFields({ email, password });
        if (missing) return alert(missing);

        const identityError = checkEmail(email, currentUser);
        if (identityError) return alert(identityError);
        try {
            await reauthenticate(email, password);
            await deleteUser(auth.currentUser);
            completeAction(setShowDeleteAccountModal, "Account removed successfully!");
            router.replace("/");

        } catch (error) {
            handleAuthErrors(error, "delete account");
        }
    };

    return { ...context, changePassword, deleteAccount };
}
