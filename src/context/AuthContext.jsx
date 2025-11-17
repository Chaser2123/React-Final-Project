'use client'

import { createContext, useState } from "react";
import { useRouter } from "next/navigation";

export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
    // Track the current user; default to 'guest' when no user is set
    const [currentUser, setCurrentUser] = useState('guest');
    const router = useRouter();

    // Keep existing flags for backward compatibility
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [userRole, setUserRole] = useState("");

    const login = (user) => {
        // Accept either a role string (backwards compatible) or a user object
        let role = "";
        let firstName = "";
        let lastName = "";
        if (typeof user === 'string') {
            role = user || 'user';
        } else if (user && typeof user === 'object') {
            role = user.role || 'user';
            firstName = user.firstName || user.name || '';
            lastName = user.lastName || '';
        } else {
            role = 'user';
        }
        setIsAuthorized(true);
        setUserRole(role);
        setCurrentUser({ role, firstName, lastName });
    };

    const logout = () => {
        setIsAuthorized(false);
        setUserRole("");
        setCurrentUser('guest');
        router.replace('/');
    };

    return (
        <AuthContext.Provider value={{ currentUser, setCurrentUser, isAuthorized, userRole, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}