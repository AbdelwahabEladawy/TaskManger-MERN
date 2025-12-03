import React, { useEffect, useState } from 'react'
import axiosInstance from '../../utils/axoisInstance'
import { API_PATHS } from '../../utils/apiPaths'
import { LuUsers } from 'react-icons/lu'
import Modal from '../modal/Modal'

function SelectUsers({ selectedUsers, setSelectedUsers }) {
    const [allUsers, setAllUsers] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [tempSelectedUsers, setTempSelectedUsers] = useState([])

    const getAllUsers = async () => {
        try {
            const response = await axiosInstance.get(API_PATHS.USERS.GET_ALL)
            const users = response.data?.usersWithTasksCounts || []
            setAllUsers(users)
        } catch (error) {
            console.log("Error Fetching Users", error)
        }
    }

    const toggleUserSelection = (userId) => {
        setTempSelectedUsers((prev) =>
            prev.includes(userId)
                ? prev.filter((id) => id !== userId)
                : [...prev, userId]
        )
    }

    const handleAssign = () => {
        setSelectedUsers(tempSelectedUsers)
        setIsModalOpen(false)
    }

    useEffect(() => {
        getAllUsers()
    }, [])

    useEffect(() => {
     
        if (isModalOpen) {
            setTempSelectedUsers(selectedUsers || [])
        }
    }, [isModalOpen, selectedUsers])

    const selectedUsersAvatar = allUsers
        .filter((user) => selectedUsers?.includes(user._id))
        .map((user) => user.profileImage)
 
    return (
        <div className='space-y-4 mt-2'>
            {selectedUsersAvatar?.length === 0 && (
                <button className='card-btn' onClick={() => setIsModalOpen(true)}>
                    <LuUsers className='text-sm' />
                    Add Members
                </button>
            )}

            {selectedUsersAvatar?.length > 0 && (
                <div className='flex items-center gap-2'>
                    {selectedUsersAvatar.map((img, index) => (
                        <img
                            key={index}
                            src={img}
                            alt='user'
                            className='w-8 h-8 rounded-full'
                        />
                    ))}

                    <button
                        className='text-sm text-primary'
                        onClick={() => setIsModalOpen(true)}
                    >
                        Edit
                    </button>
                </div>
            )}

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Select Users"
            >
                <div className='space-y-4 h-[60vh] overflow-y-scroll'>
                    {allUsers.map((user) => (
                        <div
                            className="flex items-center gap-4 p-3 border border-b border-gray-200"
                            key={user._id}
                        >
                            <img
                                src={user.profileImage || "https://www.w3schools.com/howto/img_avatar.png"}
                                alt={user.name}
                                className='w-10 h-10 rounded-full'
                            />

                            <div className="flex-1">
                                <p className="font-medium text-gray-800 dark:text-white">{user.name}</p>
                                <p className="font-[13px] text-gray-500">{user.email}</p>
                            </div>

                            <input
                                type="checkbox"
                                checked={tempSelectedUsers.includes(user._id)}
                                onChange={() => toggleUserSelection(user._id)}
                                className='w-4 h-4 text-primary bg-gray-100 border border-gray-300 rounded-sm outline-none'
                            />
                        </div>
                    ))}
                </div>

                <div className='flex justify-end pt-4 gap-2 border-t border-gray-200'>
                    <button
                        className='card-btn'
                        onClick={handleAssign}
                    >
                        Save
                    </button>
                    <button
                        className='card-btn-fill'
                        onClick={() => setIsModalOpen(false)}
                    >
                        Cancel
                    </button>
                </div>
            </Modal>
        </div>
    )
}

export default SelectUsers
