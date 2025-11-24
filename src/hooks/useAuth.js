import {useContext } from "react";
import { AuthContext } from "@/context/AuthContext.jsx";

export default function useAuth() {
    const auth = useContext(AuthContext);
    return auth;
}