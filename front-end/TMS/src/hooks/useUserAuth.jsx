import { useContext, useEffect } from "react";
import { userContext } from "../context/userContext";
import { useNavigate } from "react-router-dom";

export default function useUserAuth() {
    const { user, loading, clearUser } = useContext(userContext);
    const navigate = useNavigate()

    useEffect(() => {

        if (loading) return;
        if (user) return
        if (!user) {
            // clearUser();
            navigate("/login");
        }

    }, [user, loading, navigate, clearUser])




} 