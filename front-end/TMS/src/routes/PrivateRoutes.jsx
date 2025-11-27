import React from 'react'
import { Outlet } from 'react-router-dom'

export default function PrivateRoutes({ allowsRoles }) {
    return <Outlet/>
}
