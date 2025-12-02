import React, { useEffect, useState } from 'react'
import axiosInstance from '../../utils/axoisInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { LuUsers } from 'react-icons/lu';

function SelectUsers({ selectedUsers, setSelectedUsers }) {
    const [allUsers, setAllUsers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [tempSelectedUsers, setTempSelectedUsers] = useState([]);

    const getAllUsers = async () => {
        try {
            const response = await axiosInstance.get(API_PATHS.USERS.GET_ALL);
            if (response.data?.length > 0) {
                setAllUsers(response.data);
            }
        } catch (error) {
            console.log("Error Fetching Users", error);
        }
    };

    const toggleUserSelection = (userId) => {
        setTempSelectedUsers((prevSelectedUsers) => {
            if (prevSelectedUsers.includes(userId)) {
                return prevSelectedUsers.filter((id) => id !== userId);
            } else {
                return [...prevSelectedUsers, userId];
            }
        });
    };

    const handleAssign = () => {
        setSelectedUsers(tempSelectedUsers);
        setIsModalOpen(false);
    };

    useEffect(() => {
        getAllUsers();
    }, []);

    useEffect(() => {
        if (selectedUsers?.length === 0) {
            setTempSelectedUsers([]);
        }
    }, [selectedUsers]);

    const selectedUsersAvatar = allUsers
        .filter((user) => tempSelectedUsers.includes(user._id))
        .map((user) => user.profileImage);

    return (
        <div className='space-y-4 mt-2'>
            {selectedUsersAvatar?.length === 0 && (
                <button className='card-btn' onClick={() => { setIsModalOpen(true) }}>
                    <LuUsers className='text-sm' />
                    Add Members
                </button>
            )}
        </div>
    );
}

export default SelectUsers;