import React, { useState } from 'react'
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6"

export default function Input({ type, value, onChange, placeholder, label }) {
    const [showPassword, setShowPassword] = useState(false);

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div>
            <label className="text-[13px] text-slate-800">{label}</label>

            <div className="input-box flex items-center gap-2">
                <input
                    type={
                        type === "password"
                            ? (showPassword ? "text" : "password")
                            : type
                    }
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className="w-full bg-transparent outline-none"
                />

                {type === "password" && (
                    showPassword ? (
                        <FaRegEyeSlash
                            size={22}
                            className=" text-slate-600 cursor-pointer"
                            onClick={toggleShowPassword}
                        />
                    ) : (
                        <FaRegEye
                            size={22}
                                className="text-primary  cursor-pointer"
                            onClick={toggleShowPassword}
                        />
                    )
                )}
            </div>
        </div>
    );
}
