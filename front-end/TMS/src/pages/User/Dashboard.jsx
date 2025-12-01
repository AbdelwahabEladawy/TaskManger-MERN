import React, { use, useContext } from 'react'
import useUserAuth from '../../hooks/useUserAuth';
import { userContext } from '../../context/userContext';

export default function UserDashboard() {
  useUserAuth();    
    return (
        <div>
           asdf
        </div>
    )
}
