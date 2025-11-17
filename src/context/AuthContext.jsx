'use client'

import { createContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
    // Track the current user; default to 'guest' when no user is set
    const [currentUser, setCurrentUser] = useState('guest');
    const router = useRouter();

    // Keep existing flags for backward compatibility
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [userRole, setUserRole] = useState("");

    // Subscribe to Firebase auth state and load profile from Firestore
    useEffect(() => {
        const unsub = onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    const profileRef = doc(db, "users", user.uid);
                    const snap = await getDoc(profileRef);
                    const profile = snap.exists() ? snap.data() : {};
                    const role = profile.role || 'user';
                    const firstName = profile.firstName || '';
                    const lastName = profile.lastName || '';
                    setIsAuthorized(true);
                    setUserRole(role);
                    setCurrentUser({ role, firstName, lastName, uid: user.uid, email: user.email });
                } catch (e) {
                    // Fallback to minimal user data if profile fetch fails
                    setIsAuthorized(true);
                    setUserRole('user');
                    setCurrentUser({ role: 'user', firstName: '', lastName: '', uid: user.uid, email: user.email });
                }
            } else {
                setIsAuthorized(false);
                setUserRole("");
                setCurrentUser('guest');
            }
        });
        return () => unsub();
    }, []);

    // Login via Firebase Auth
    const login = async ({ email, password }) => {
        await signInWithEmailAndPassword(auth, email, password);
        // onAuthStateChanged will update context
    };

    // Logout via Firebase Auth
    const logout = async () => {
        await signOut(auth);
        router.replace('/');
    };

    return (
        <AuthContext.Provider value={{ currentUser, setCurrentUser, isAuthorized, userRole, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}