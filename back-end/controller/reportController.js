import User from "../models/User.js"
import Task from "../models/Task.js"
import exelJs from "exceljs"





export const exportTaskReport = async (req, res) => {
    try {
        const tasks = await Task.find().populate("assignedTo", "name email ")
        const workBook = new exelJs.Workbook()
        const workSheet = workBook.addWorksheet("Task Report")
        workSheet.columns = [
            { header: "Task ID", key: "_id", width: 25 },
            { header: "Title", key: "title", width: 30 },
            { header: "Description", key: "description", width: 50 },
            { header: "Priority", key: "priority", width: 15 },
            { header: "Due Date", key: "dueDate", width: 20 },
            { header: "Status", key: "status", width: 20 },
            { header: "Assigned To", key: "assignedTo", width: 30 },
        ]

        tasks.forEach((task) => {
            const assignedTo = task.assignedTo.map((user) => { `${user.name} (${user.email})` }).join(", ")
            workSheet.addRow({
                _id: task._id,
                title: task.title,
                description: task.description,
                priority: task.priority,
                dueDate: task.dueDate.toISOString().split("T")[0],
                status: task.status,
                assignedTo: assignedTo,
            })
        })
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
        res.setHeader("Content-Disposition", "attachment; filename=task-report.xlsx")
        return workBook.xlsx.write(res).then(() => res.end())

    } catch (error) {
        res.status(500).json({ message: "Error  exporting task report", error: error.message })
    }

}
export const exportUserReport = async (req, res) => {
    try {
        const users = await User.find().select("name email _id").lean()
        const userTasks = await Task.find().populate("assignedTo", "name email _id")

        const userTaskMap = {}
        users.forEach(user => {
            userTaskMap[user._id] = {
                name: user.name,
                email: user.email,
                taskCount: 0,
                pendingTasks: 0,
                inProgressTasks: 0,
                completedTasks: 0

            }
        })
        userTasks.forEach((task) => {
            if (task.assignedTo) {
                task.assignedTo.forEach((assignedUser) => {
                    if (userTaskMap[assignedUser._id]) {
                        userTaskMap[assignedUser._id].taskCount += 1
                        if (task.status === "pending") {
                            userTaskMap[assignedUser._id].pendingTasks += 1
                        } else if (task.status === "In Progress") {
                            userTaskMap[assignedUser._id].inProgressTasks += 1
                        } else if (task.status === "completed") {
                            userTaskMap[assignedUser._id].completedTasks += 1
                        }
                        }
                        
                    
                })


                const workBook = new exelJs.Workbook()
                const workSheet = workBook.addWorksheet("Task Report")
                workSheet.columns = [
                 
                    { header: "User Name", key: "name", width: 30 },
                    { header: "Email", key: "email", width: 40 },
                    { header: "Total Assigned Tasks", key: "taskCount", width: 20 },
                    { header: "Pending Tasks", key: "pendingTasks", width: 20 },
                    { header: "In Progress Tasks", key: "inProgressTasks", width: 20 },
                    { header: "Completed Tasks", key: "completedTasks", width: 20 },
                ]

                const userData = Object.values(userTaskMap)
                userData.forEach((user) => {
                    workSheet.addRow(user)
                })
                res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
                res.setHeader("Content-Disposition", "attachment; filename=users-report.xlsx")
                return workBook.xlsx.write(res).then(() => res.end())

            }
        })

    } catch (error) {
        res.status(500).json({ message: "Error  exporting task report", error: error.message })
    }
}