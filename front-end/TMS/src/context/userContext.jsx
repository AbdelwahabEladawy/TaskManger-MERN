import { createContext, useState, useEffect } from "react";

export const userContext = createContext();

export default function UserProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedUser = localStorage.getItem("user");

        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }

        setLoading(false);
    }, []);

    const updateUser = ({ user, token }) => {
        if (user) {
            setUser(user);
            localStorage.setItem("user", JSON.stringify(user));
        }

        if (token) {
            setToken(token);
            localStorage.setItem("token", token);
        }
    };

    return (
        <userContext.Provider value={{ user, token, loading, updateUser }}>
            {children}
        </userContext.Provider>
    );
}
