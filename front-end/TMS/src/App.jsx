import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Login from './pages/auth/login'
import Signup from './pages/auth/signup'
import PrivateRoutes from './routes/PrivateRoutes'
import AdminDashboard from './pages/Admin/Dashboard'
import ManageTasks from './pages/Admin/ManageTasks'
import CreateTask from './pages/Admin/createTask'
import ManageUsers from './pages/Admin/ManageUsers'
import UserDashboard from './pages/User/Dashboard'
import MyTasks from './pages/User/MyTasks'

function App() {


  return (
    <div>
      <Router>
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />

          {/* Admin Routes */}
          <Route element={<PrivateRoutes allowsRoles={["admin"]} />} >
            <Route path='/admin/dashboard' element={<AdminDashboard />} />
            <Route path='/admin/tasks' element={<ManageTasks />} />
            <Route path='/admin/create-task' element={<CreateTask />} />
            <Route path='/admin/users' element={<ManageUsers />} />
          </Route>
          <Route element={<PrivateRoutes allowsRoles={["admin"]} />} >
            <Route path='/user/dashboard' element={<UserDashboard />} />
            <Route path='/user/tasks ' element={<MyTasks />} />
            <Route path='/user/dashboard' element={<ViewTaskDetails />} />
            
          </Route>
        </Routes>
      </Router>

    </div >

  )
}

export default App
