import React, { useContext, useState } from 'react'
import AuthLayout from '../../components/layouts/AuthLayout'
import { Link, useNavigate } from 'react-router-dom'
import Input from '../../components/layouts/inputs/Input'
import axiosInstance from '../../utils/axoisInstance'
import { API_PATHS } from '../../utils/apiPaths'
import { userContext } from '../../context/userContext'

export default function Signup() {
  const [profilePic, setProfilePic] = useState(null)
  const [fullname, setFullname] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [adminInviteToken, setAdminInviteToken] = useState("")
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const { updateUser } = useContext(userContext)

  const handleProfilePicChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePic(e.target.files[0])
    }
  }

  const handleSignup = async (e) => {
    e.preventDefault()
    setError(null) // إعادة تعيين أي خطأ سابق

    try {
      console.log("📌 Starting signup...")
      console.log("Form Data:", { fullname, email, password, adminInviteToken, profilePic })

      // تسجيل المستخدم
      const registerResponse = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        name: fullname,
        email,
        password,
        adminInviteToken
      })

      console.log("✅ Register response:", registerResponse.data)

      const { token, user } = registerResponse.data

      if (!token || !user) {
        console.error("❌ Token or user missing from register response")
        setError("Signup failed: invalid server response")
        return
      }

      localStorage.setItem("token", token)
      updateUser({ user, token })

      let uploadedImageUrl = ""

      // رفع الصورة إذا موجودة
      if (profilePic) {
        try {
          console.log("📌 Uploading profile image...")
          const formData = new FormData()
          formData.append("image", profilePic)

          const uploadResponse = await axiosInstance.post(
            API_PATHS.AUTH.UPLOAD_IMAGE,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`,
              },
            }
          )

          console.log("✅ Upload response:", uploadResponse.data)
          uploadedImageUrl = uploadResponse.data?.imageUrl || ""

          if (uploadedImageUrl) {
            console.log("📌 Updating user profile with image...")
            const updateResponse = await axiosInstance.put(
              API_PATHS.AUTH.PROFILE,
              { profileImage: uploadedImageUrl },
              { headers: { Authorization: `Bearer ${token}` } }
            )
            console.log("✅ Update profile response:", updateResponse.data)
          }
        } catch (uploadError) {
          console.error("❌ Error uploading profile image:", uploadError)
        }
      }

      // التوجيه بعد التسجيل
      console.log("📌 Navigating based on role:", user.role)
      if (user.role === "admin") navigate("/admin/dashboard")
      else if (user.role === "user") navigate("/user/dashboard")
      else {
        console.warn("⚠️ Unknown user role, redirecting to login")
        setError("Unknown user role")
      }

    } catch (error) {
      console.error("❌ Signup error:", error)
      setError(error.response?.data?.message || "Something went wrong")
    }
  }

  return (
    <AuthLayout>
      <div className='lg:w-[70%] h-full flex flex-col justify-center '>
        <h2 className='text-2xl font-bold text-black '>Create An Account</h2>
        <p className='text-sm font-medium text-slate-700 mt-[5px] mb-6 '>Please fill in the details to create your account</p>

        <form onSubmit={handleSignup} className='flex flex-col gap-4 '>

          <div className='flex flex-col items-center gap-2 mb-2'>
            <label htmlFor="profilePic" className='cursor-pointer w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center border-2 border-dashed border-gray-400 hover:border-primary transition-colors'>
              {profilePic ? (
                <span className='text-xs text-gray-600 p-2 text-center'>Selected</span>
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

          <Input
            value={fullname}
            onChange={({ target }) => setFullname(target.value)}
            type="text"
            placeholder='Full Name'
          />

          <Input
            value={email}
            onChange={({ target }) => setEmail(target.value)}
            type="email"
            placeholder='youremail@example.com'
          />

          <Input
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            type="password"
            placeholder='min 8 characters'
          />

          <Input
            value={adminInviteToken}
            onChange={({ target }) => setAdminInviteToken(target.value)}
            type="text"
            placeholder='Admin Invite Token (Optional)'
          />

          {error && <p className='text-red-500 text-sm pb-2.5'>{error}</p>}

          <button type='submit' className='btn-primary '>SIGN UP</button>

          <p className='text-[13px] text-slate-800 mt-3'>
            Already have an account?
            <Link className='text-primary underline font-bold ps-1' to={"/login"}>
              Login
            </Link>
          </p>
        </form >
      </div>
    </AuthLayout>
  )
}
