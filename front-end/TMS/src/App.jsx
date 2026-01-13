import { useContext, useState } from 'react'
import { BrowserRouter as Router, Route, Routes, Outlet, Navigate } from 'react-router-dom'
import Login from './pages/auth/login'
import Signup from './pages/auth/signup'
import PrivateRoutes from './routes/PrivateRoutes'
import AdminDashboard from './pages/Admin/Dashboard'
import ManageTasks from './pages/Admin/ManageTasks'
import CreateTask from './pages/Admin/createTask'
import ManageUsers from './pages/Admin/ManageUsers'
import UserDashboard from './pages/User/Dashboard'
import MyTasks from './pages/User/MyTasks'
import UserProvider, { userContext } from './context/userContext'
import { Toaster } from 'react-hot-toast'
import ViewTaskDetails from './pages/User/ViewTaskDetails'

function App() {


  return (
    <UserProvider>
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
              <Route path='/admin/create-task/:taskId' element={<CreateTask />} />
              <Route path='/admin/users' element={<ManageUsers />} />
            </Route>
            <Route element={<PrivateRoutes allowsRoles={["admin"]} />} >
              <Route path='/user/dashboard' element={<UserDashboard />} />
              <Route path='/user/tasks' element={<MyTasks />} />
              <Route path='/user/tasks/:id' element={<ViewTaskDetails />} />
              {/* <Route path='/user/dashboard' element={<ViewTaskDetails />} /> */}

            </Route>
            {/* default route */}
            <Route path='/' element={<Root />} />

          </Routes>
        </Router>

      </div >
      <Toaster
        toastOptions={{
          className: '',
          style: {
        
            fontSize: '16px'
          }
      }}    />
    </UserProvider>

  )
}

export default App

const Root = () => {
  const { user, loading } = useContext(userContext);

  if (loading) return <div>Loading...</div>;

 
  if (user) {
    return user.role === "admin"
      ? <Navigate to="/admin/dashboard" />
      : <Navigate to="/user/dashboard" />;
  }


  return <Navigate to="/login" />;
};
