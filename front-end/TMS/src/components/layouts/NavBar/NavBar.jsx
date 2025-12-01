import React, { useState } from 'react'
import SideMenu from '../SideMenu/SideMenu'
import { HiOutlineMenu, HiOutlineX } from 'react-icons/hi';

export default function NavBar({activeMenu}) {
    const [openSideMenu, setOpenSideMenu] = useState(false)
    return (
        <div className='flex gap-5 border border-b bg-white border-gray-200/50 backdrop-blur[2px] py-4 px-7 sticky top-0 z-30'>
            <button className='block lg:hidden text-black' onClick={() => { setOpenSideMenu(!openSideMenu) }} >

                {openSideMenu ? (
                    <HiOutlineX className='text-2xl' />
                ) : (
                    <HiOutlineMenu className='text-2xl' />
                )}

            </button>

            <h2 className='text-lg font-medium text-black'>Task Manager</h2>


            {
                openSideMenu && (
                    <div className='fixed top-[61px] -ml-4 bg-white '>
                        <SideMenu activeMenu={activeMenu} />
                    </div>
                )
            }
        </div>
    )
}
