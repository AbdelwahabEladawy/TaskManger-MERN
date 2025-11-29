import User from "../models/User.js"
import Task from "../models/Task.js"





export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password")
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }
        res.status(200).json({ user })

    } catch (error) {
        return res.status(500).json({ message: "Server Error", error: error.message })
    }
}
export const getUsers = async (req, res) => {
    try {
        const users = await User.find({ role: "user" }).select("-password")

        const usersWithTasksCounts = await Promise.all(users.map(async (user) => {
            const pendingTasks = await Task.countDocuments({ assignedTo: user._id, status: "pending" })
            const inProgressTasks = await Task.countDocuments({ assignedTo: user._id, status: "In Progress" })
            const completedTasks = await Task.countDocuments({ assignedTo: user._id, status: "completed" })
            return { ...user._doc, pendingTasks, inProgressTasks, completedTasks }
        }))

        res.status(200).json({ usersWithTasksCounts })

    } catch (error) {
        return res.status(500).json({ message: "Server Error", error: error.message })
    }
}
