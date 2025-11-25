'use client'

import { createContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, setPersistence, browserLocalPersistence, updateProfile } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
    // Track the current user; default to 'guest' when no user is set
    const [currentUser, setCurrentUser] = useState('guest');
    const [isInitializing, setIsInitializing] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    // Keep existing flags for backward compatibility
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [userRole, setUserRole] = useState("");

    // Subscribe to Firebase auth state and load profile from Firestore
    useEffect(() => {
        let unsub = () => {};
        let cancelled = false;
        (async () => {
            try {
                await setPersistence(auth, browserLocalPersistence);
            } catch (e) {
                // eslint-disable-next-line no-console
                console.warn('Failed to set auth persistence; continuing with default.', e);
            }
            // Prime immediately from existing session if available to avoid any visual delay
            const existing = auth.currentUser;
            if (existing) {
                const display = (existing.displayName || '').trim();
                const [firstNameFromAuth, ...rest] = display ? display.split(' ') : [''];
                const lastNameFromAuth = rest.length ? rest.join(' ') : '';
                setIsAuthorized(true);
                setUserRole('user');
                setCurrentUser({ role: 'user', firstName: firstNameFromAuth || '', lastName: lastNameFromAuth || '', uid: existing.uid, email: existing.email || '' });
            }
            if (cancelled) return;
            unsub = onAuthStateChanged(auth, async (user) => {
                if (user) {
                    setIsAuthorized(true);
                    setUserRole('user');
                    const display = (user.displayName || '').trim();
                    const [firstNameFromAuth, ...rest] = display ? display.split(' ') : [''];
                    const lastNameFromAuth = rest.length ? rest.join(' ') : '';
                    setCurrentUser({ role: 'user', firstName: firstNameFromAuth || '', lastName: lastNameFromAuth || '', uid: user.uid, email: user.email || '' });
                    // Check if this is a new user just signed up
                    let newUserData = null;
                    try {
                        newUserData = JSON.parse(window.localStorage.getItem('newUserJustSignedUp'));
                    } catch {}
                    if (newUserData && newUserData.uid === user.uid) {
                        // Write user profile to Firestore
                        try {
                            await setDoc(doc(db, 'users', user.uid), {
                                email: newUserData.email,
                                firstName: newUserData.firstName,
                                lastName: newUserData.lastName,
                                role: newUserData.role,
                                createdAt: serverTimestamp(),
                            }, { merge: true });
                        } catch (e) {
                            // eslint-disable-next-line no-console
                            console.warn('Failed to write new user profile to Firestore', e);
                        }
                        window.localStorage.removeItem('newUserJustSignedUp');
                    }
                    try {
                        const profileRef = doc(db, "users", user.uid);
                        const snap = await getDoc(profileRef);
                        const profile = snap.exists() ? snap.data() : {};
                        const role = profile.role || 'user';
                        const firstName = profile.firstName || '';
                        const lastName = profile.lastName || '';
                        setUserRole(role);
                        setCurrentUser({ role, firstName, lastName, uid: user.uid, email: user.email });
                    } catch (e) {
                        setUserRole('user');
                        setCurrentUser({ role: 'user', firstName: '', lastName: '', uid: user.uid, email: user.email || '' });
                    } finally {
                        setIsInitializing(false);
                    }
                } else {
                    setIsAuthorized(false);
                    setUserRole("");
                    setCurrentUser('guest');
                    setIsInitializing(false);
                }
            });
        })();
        return () => { cancelled = true; unsub && unsub(); };
    }, []);

    // Login via Firebase Auth
    const primeAuthUser = (user, overrides = {}) => {
        if (!user) return;
        const display = (user.displayName || '').trim();
        const [firstNameFromAuth, ...rest] = display ? display.split(' ') : [''];
        const lastNameFromAuth = rest.length ? rest.join(' ') : '';
        const firstName = overrides.firstName ?? firstNameFromAuth ?? '';
        const lastName = overrides.lastName ?? lastNameFromAuth ?? '';
        setIsAuthorized(true);
        setUserRole(overrides.role || 'user');
        setCurrentUser({ role: overrides.role || 'user', firstName, lastName, uid: user.uid, email: user.email || '' });
    };

    const login = async ({ email, password }) => {
        setIsLoading(true);
        try {
            const cred = await signInWithEmailAndPassword(auth, email, password);
            // Prime immediately using available displayName/email
            primeAuthUser(cred.user);
            // Don't fetch from Firestore here—let onAuthStateChanged handle it to avoid duplicate requests
            // that cause NS_BINDING_ABORTED errors
        } finally {
            setIsLoading(false);
        }
    };

    // Logout via Firebase Auth
    const logout = async () => {
        await signOut(auth);
        router.replace('/');
    };

    return (
        <AuthContext.Provider value={{ currentUser, setCurrentUser, isAuthorized, userRole, isInitializing, isLoading, login, logout, primeAuthUser }}>
            {children}
        </AuthContext.Provider>
    );
}