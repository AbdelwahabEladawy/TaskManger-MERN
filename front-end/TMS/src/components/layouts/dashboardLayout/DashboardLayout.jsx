import React, { use } from 'react'
import NavBar from '../NavBar/NavBar'
import SideMenu from '../SideMenu/SideMenu'
import { useContext } from 'react';
import { userContext } from '../../../context/userContext';

export default function DashboardLayout({ children, activeMenu }) {
    const {user}=useContext(userContext);
    return (
        <div>
            <NavBar activeMenu={activeMenu} />
            {user && (
                <div className="flex">
                    <div className="max-[1080px]:hidden">
                        <SideMenu activeMenu={activeMenu} />
                    </div>
                    <div className="grow mx-5">{children}</div>
                </div>
            )}
        </div>
    )
}
