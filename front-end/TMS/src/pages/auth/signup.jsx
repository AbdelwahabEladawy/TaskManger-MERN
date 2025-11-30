import React, { useState } from 'react'
import AuthLayout from '../../components/layouts/AuthLayout'
import { Link, useNavigate } from 'react-router-dom'
import Input from '../../components/layouts/inputs/Input'

export default function Signup() {
  const [profilePic, setProfilePic] = useState(null)
  const [fullname, setFullname] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [adminInviteToken, setAdminInviteToken] = useState("")
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const handleSignup = async (e) => {
    e.preventDefault()
    // Add your signup logic here (e.g., API call)
    console.log("Attempting to sign up with:", { fullname, email, password, adminInviteToken, profilePic })
    // Example: setError("Signup failed. Please check your information.")
    // Example: navigate("/dashboard")
  }

  // Handler for file input change
  const handleProfilePicChange = (e) => {
    // Here you would handle file upload/preview logic
    if (e.target.files && e.target.files[0]) {
      setProfilePic(e.target.files[0])
    }
  }

  return (
    <AuthLayout>
      {/* Container maintains similar size and alignment to the Login page */}
      {/* We use lg:w-[70%] for consistency, but might need adjustment if content overflows */}
      <div className='lg:w-[70%] h-full flex flex-col justify-center '>
        <h2 className='text-2xl font-bold text-black '>Create An Account</h2>
        <p className='text-sm font-medium text-slate-700 mt-[5px] mb-6 '>Please fill in the details to create your account</p>

        <form onSubmit={handleSignup} className='flex flex-col gap-4 '>

          {/* 1. Profile Picture Input (Stylized File Input) */}
          <div className='flex flex-col items-center gap-2 mb-2'>
            <label htmlFor="profilePic" className='cursor-pointer w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center border-2 border-dashed border-gray-400 hover:border-primary transition-colors'>
              {profilePic ? (
                // Simple placeholder for image preview (in a real app, use URL.createObjectURL)
                <span className='text-xs text-gray-600 p-2 text-center'>Image Selected</span>
              ) : (
                <span className='text-gray-500 text-sm'>Add Photo</span>
              )}
            </label>
            <input
              id="profilePic"
              type="file"
              accept="image/*"
              onChange={handleProfilePicChange}
              className='hidden'
            />
          </div>

          {/* 2. Full Name Input */}
          <Input
            value={fullname}
            onChange={({ target }) => setFullname(target.value)}
            type="text"
            placeholder='Full Name'
            className=''
          />

          {/* 3. Email Input */}
          <Input
            value={email}
            onChange={({ target }) => setEmail(target.value)}
            type="email"
            placeholder='youremail@example.com'
            className=''
          />

          {/* 4. Password Input */}
          <Input
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            type="password"
            placeholder='min 8 characters'
            className=''
          />

          {/* 5. Admin Invite Token (Optional/Conditional) */}
          <Input
            value={adminInviteToken}
            onChange={({ target }) => setAdminInviteToken(target.value)}
            type="text"
            placeholder='Admin Invite Token (Optional)'
            className=''
          />

          {error && <p className='text-red-500 text-sm pb-2.5'>{error}</p>}

          {/* Submit Button */}
          <button type='submit' className='btn-primary '>SIGN UP</button>

          {/* Link to Login */}
          <p className='text-[13px] text-slate-800 mt-3'>Already have an account?
            <Link className='text-primary underline font-bold ps-1' to={"/login"}>
              Login
            </Link>
          </p>
        </form >
      </div>
    </AuthLayout>
  )
}