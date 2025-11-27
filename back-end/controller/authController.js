
import User from "../models/User.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"


// jwt token 
export const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "7d"
    })

}
// @Public 
export const registerUser = async (req, res) => {
    try {
        const { name, email, password, profileImage, adminInviteToken } = req.body
        const userExists = await User.findOne({ email })
        // check if user exists
        if (userExists) {
            return res.status(400).json({ message: "User already exists" })
        }
        // determine if admin and invite token is valid

        let role = "user"
        if (adminInviteToken && adminInviteToken === process.env.ADMIN_INVITE_TOKEN) {
            role = "admin"
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role,
            profileImage
        })
        const token = generateToken(user._id)
        res.status(201).json({ message: "User created successfully", user, token })




    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message })
    }
}



export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" })
        }
        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid Password" })
        }
        const token = generateToken(user._id)
        res.status(200).json({ message: "Login successful", user, token })

    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message })
    }
}





// @Private

export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password")
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        res.status(200).json({ message: "User profile", user })

    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message })
    }
}
export const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)

        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }
        user.name = req.body.name || user.name
        user.email = req.body.email || user.email
        user.profileImage = req.body.profileImage || user.profileImage

        if (req.body.password) {
            user.password = await bcrypt.hash(req.body.password, 10)
        }
        const updatedUser = await user.save()
        res.status(200).json({
            message: "User profile updated",
            user: {
                id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                profileImage: updatedUser.profileImage,
                token: generateToken(updatedUser._id)
            }
        })

        // res.status(200).json({ message: "User profile updated", user })


    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message })
    }
}