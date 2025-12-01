import React, { useContext, useEffect, useState } from 'react'
import { userContext } from '../../../context/userContext';
import { useNavigate } from 'react-router-dom';
import { SIDE_MENU_DATA, SIDE_MENU_USER_DATA } from '../../../utils/data';

export default function SideMenu({ activeMenu }) {
    const { user } = useContext(userContext);
    const [sideMenuData, setSideMenuData] = useState([])
    const navigate = useNavigate();


    const handleClick = (route) => {
        if (route === 'logout') {
            {
                handleLogout();
                return;
            }
            navigate(route);
        }
    }

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    }



    useEffect(() => {

        if (user) {
            setSideMenuData(user.role === "admin" ? SIDE_MENU_DATA : SIDE_MENU_USER_DATA);
        }
        return () => { };

    }, [user]);





    return (
        <div className='w-64 h-[calc(100vh-61px)] bg-white  border-r border-gray-200/50 sticky top-[61px] z-20'>
            <div className="flex flex-col items-center justify-center mb-7 pt-5">
                <div className="">
                    <img src={user?.profileImage ? user.profileImage : ""} alt="profile image "
                        className='w-20 h-20 bg-slate-400 rounded-full' />

                </div>

                {user?.role === "admin" && (
                    <div className="text-[10px] font-medium text-white bg-primary px-3 py-0.5  rounded mt-2">
                        <h2 className="">Admin</h2>
                    </div>
                )}

                <h5 className='text-gray-950 font-medium leading-6 mt-3'>{user?.name || ""}</h5>
                <p className='text-gray-950 font-medium leading-6 mt-3'>{user?.email || ""}</p>

                {SIDE_MENU_DATA.map((item, index) => {
                    return <button key={`menu_${index}`}
                        className={`w-full flex items-center gap-4 text-[15px] ${activeMenu == item.label ? "text-primary bg-linear-to-r from-blue-50/40 to-blue-100/50 border-r-3 " : ""}  mt-6 px-2 mb-3 cursor-pointer font-medium py-2 hover:bg-blue-50/40 hover:border-r-3 hover:border-primary transition-all`}
                        onClick={() => handleClick(item.path)}
                    >


                        <item.icon className='text-xl' />
                        {item.label}
                    </button>
                })}
            </div>
        </div>
    )
}
