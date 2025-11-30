import React from 'react'
import useUserAuth from '../../hooks/useUserAuth';

export default function AdminDashboard() {
    useUserAuth();
    return (
        <div>
            dashboard
        </div>
    )
}
