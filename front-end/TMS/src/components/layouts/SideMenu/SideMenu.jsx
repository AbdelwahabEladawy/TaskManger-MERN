import React, { useContext, useEffect, useState } from 'react';
import { userContext } from '../../../context/userContext';
import { useNavigate, useLocation } from 'react-router-dom'; // 1. استيراد useLocation
import { SIDE_MENU_DATA, SIDE_MENU_USER_DATA } from '../../../utils/data';

export default function SideMenu() { // شيلنا الـ prop activeMenu لأنه خلاص بقى أوتوماتيك
    const { user } = useContext(userContext);
    const [sideMenuData, setSideMenuData] = useState([]);

    const navigate = useNavigate();
    const location = useLocation(); // 2. هوك لمعرفة الرابط الحالي

    const handleClick = (route) => {
        if (route === 'logout') {
            handleLogout();
            return;
        }
        // 3. إصلاح التوجيه: الأمر ده كان ناقص
        navigate(route);
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    useEffect(() => {
        if (user) {
            setSideMenuData(user.role === "admin" ? SIDE_MENU_DATA : SIDE_MENU_USER_DATA);
        }
    }, [user]);

    return (
        <div className='w-64 h-[calc(100vh-61px)] bg-white border-r border-gray-200/50 sticky top-[61px] z-20'>
            <div className="flex flex-col items-center justify-center mb-7 pt-5">

                {/* Profile Image */}
                <div className="">
                    <img
                        src={user?.profileImage ? user.profileImage : "https://placehold.co/100"}
                        alt="profile"
                        className='w-20 h-20 bg-slate-200 object-cover rounded-full'
                    />
                </div>

                {/* Admin Badge */}
                {user?.role === "admin" && (
                    <div className="text-[10px] font-medium text-white bg-primary px-3 py-0.5 rounded mt-2">
                        <h2 className="">Admin</h2>
                    </div>
                )}

                {/* User Info */}
                <h5 className='text-gray-950 font-medium leading-6 mt-3'>{user?.name || "User"}</h5>
                <p className='text-gray-500 text-sm mt-1'>{user?.email || ""}</p>

                {/* Menu Items Loop */}
                {sideMenuData.map((item, index) => {
                    // 4. تحديد هل العنصر نشط بناءً على الرابط الحالي
                    // تأكد إن المسارات في ملف Data.js بتبدأ بـ / عشان المقارنة تكون صح
                    const isActive = location.pathname === item.path;

                    return (
                        <button
                            key={`menu_${index}`}
                            // 5. تنسيق الـ Active Class
                            className={`w-full flex items-center gap-4 ps-5 text-[15px] mt-6 px-2 mb-3 cursor-pointer font-medium py-2 transition-all duration-200
                                ${isActive
                                    ? "text-primary bg-blue-50 border-r-4 border-primary"
                                    : "text-gray-600 hover:bg-blue-50/40 hover:text-primary"
                                }
                            `}
                            // 6. إصلاح مشكلة الضغط (بنستدعي الدالة بـ arrow function)
                            onClick={() => handleClick(item.path)}
                        >
                            <item.icon className={`text-xl ${isActive ? "text-primary" : "text-gray-500"}`} />
                            {item.label}
                        </button>
                    )
                })}
            </div>
        </div>
    );
}