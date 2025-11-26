'use client';

import { createContext, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState("guest");
  const [isInitializing, setIsInitializing] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [userRole, setUserRole] = useState("");

  const router = useRouter();

  // Prevent repeated Firestore profile requests
  const lastFetchedUid = useRef(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setIsAuthorized(false);
        setUserRole("");
        setCurrentUser("guest");
        setIsInitializing(false);
        return;
      }

      setIsAuthorized(true);

      // Only fetch profile if it's a new user session
      if (user.uid !== lastFetchedUid.current) {
        lastFetchedUid.current = user.uid;

        try {
          const profileRef = doc(db, "users", user.uid);
          const snap = await getDoc(profileRef);
          const profile = snap.exists() ? snap.data() : {};
          // Fallback to displayName if Firestore names are missing
          let firstName = profile.firstName || "";
          let lastName = profile.lastName || "";
          if (!firstName && user.displayName) {
            const display = user.displayName.trim();
            const [first, ...rest] = display ? display.split(' ') : [''];
            firstName = first;
            lastName = rest.length ? rest.join(' ') : '';
          }
          setUserRole(profile.role || "user");
          setCurrentUser({
            uid: user.uid,
            email: user.email || "",
            role: profile.role || "user",
            firstName,
            lastName,
            creationTime: user.metadata?.creationTime,
            lastSignInTime: user.metadata?.lastSignInTime,
          });
        } catch (e) {
          console.warn("Failed to fetch Firestore profile:", e);
          // Fallback to displayName if available
          let firstName = "";
          let lastName = "";
          if (user.displayName) {
            const display = user.displayName.trim();
            const [first, ...rest] = display ? display.split(' ') : [''];
            firstName = first;
            lastName = rest.length ? rest.join(' ') : '';
          }
          setUserRole("user");
          setCurrentUser({
            uid: user.uid,
            email: user.email || "",
            role: "user",
            firstName,
            lastName,
            creationTime: user.metadata?.creationTime,
            lastSignInTime: user.metadata?.lastSignInTime,
          });
        }
      }

      setIsInitializing(false);
    });

    return () => unsubscribe();
  }, []);

  // Login function
  const login = async ({ email, password }) => {
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // No Firestore fetch here — onAuthStateChanged handles it
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    await signOut(auth);
    router.replace("/");
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthorized,
        userRole,
        isInitializing,
        isLoading,
        login,
        logout,
        setCurrentUser, // optional — useful for onboarding
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
