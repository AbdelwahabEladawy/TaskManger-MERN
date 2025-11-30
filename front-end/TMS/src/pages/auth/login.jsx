import React, { useContext, useState } from 'react'
import AuthLayout from '../../components/layouts/AuthLayout'
import { Link, useNavigate } from 'react-router-dom'
import Input from '../../components/layouts/inputs/Input'
import axiosInstance from '../../utils/axoisInstance'
import { API_PATHS } from '../../utils/apiPaths'
import { userContext } from '../../context/userContext'

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const { updateUser } = useContext(userContext)
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
      });

      const { token, user } = response.data;

     
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

     
      updateUser({ user, token });

      if (user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/user/dashboard");
      }
    } catch (error) {
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };







  return (
    <AuthLayout>
      <div className='lg:w-[70%] h-3/4 md:h md:h-full flex flex-col justify-center  '>
        <h2 className='text-2xl font-bold text-black '>Welcome Back</h2>
        <p className='text-sm font-medium text-slate-700 mt-[5px] mb-6 '>please enter your details to log in</p>

        <form onSubmit={handleLogin} className='flex flex-col gap-4 '>
          <Input
            value={email}
            onChange={({ target }) => setEmail(target.value)}
            type="email"
            placeholder='jjLwI@example.com '
            className=''
          />
          <Input
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            type="password"
            placeholder='@ min 8 characters'
            className=''
          />
          {error && <p className='text-red-500 text-sm pb-2.5'>{error}</p>}
          <button type='submit' className='btn-primary '>LOGIN</button>
          <p className='text-[13px] text-slate-800 mt-3'>Don't have an account?
            <Link className='text-primary underline font-bold ps-1' to={"/signup"}>
              SignUp
            </Link>
          </p>
        </form >
      </div>
    </AuthLayout>
  )
}
