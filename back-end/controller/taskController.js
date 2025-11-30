import Task from "../models/Task.js";



export const createTask = async (req, res) => {
    try {

        const { title, description, priority, dueDate, assignedTo, attachment, todoChecklist } = req.body;

        if (!Array.isArray(assignedTo)) {
            res.status(400).json({ message: "assignedTo must be an array of user IDs" });
        }

        const task = await Task.create({
            title,
            description,
            priority,
            dueDate,
            assignedTo,
            createdBy: req.user._id,
            attachment,
            todoChecklist
        });

        res.status(201).json({ message: "Task created successfully", task });

    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
}
export const getTasks = async (req, res) => {
    try {
        const { status } = req.query
        let filter = {};
        if (status) {
            filter.status = status
        }
        let tasks;
        if (req.user.role === 'admin') {
            tasks = await Task.find(filter).populate('assignedTo', 'name email profileImage')
        } else {
            tasks = await Task.find({ ...filter, assignedTo: req.user._id }).populate('assignedTo', 'name email profileImage')
        }

        // add completed count to tasks 

        tasks = await Promise.all(
            tasks.map(async (task) => {
                const completedCount = task.todoChecklist?.filter(item => item.completed).length;
                return { ...task._doc, completedTodoCount: completedCount }
            })





        )
        // status summary counts 

        const allTasks = await Task.countDocuments(req.user.role === "admin" ? {} : { assignedTo: req.user._id })

        const pendingTasks = await Task.countDocuments({ ...filter, status: "pending", ...(req.user.role !== "admin" && { assignedTo: req.user._id }) })

        const inProgressTasks = await Task.countDocuments({ ...filter, status: "In Progress", ...(req.user.role !== "admin" && { assignedTo: req.user._id }) })
        const completedTasks = await Task.countDocuments({ ...filter, status: "completed", ...(req.user.role !== "admin" && { assignedTo: req.user._id }) })

        return res.status(200).json({
            tasks,
            summary: {
                all: allTasks,
                pendingTasks,
                inProgressTasks,
                completedTasks
            }
        })


    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
}
export const getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id).populate('assignedTo', 'name email profileImage')
        if (!task) {
            return res.status(404).json({ message: "Task not found" })
        }
        res.json(task)
    } catch (error) {
        res.status(500).json({ message: "Server Error" })
    }
}
export const updateTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id)
        if (!task) {
            return res.status(404).json({ message: "Task not found" })
        }
        task.title = req.body.title || task.title
        task.description = req.body.description || task.description
        task.priority = req.body.priority || task.priority
        task.dueDate = req.body.dueDate || task.dueDate
        task.attachment = req.body.attachment || task.attachment
        task.todoChecklist = req.body.todoChecklist || task.todoChecklist
        if (req.body.assignedTo) {
            if (!Array.isArray(req.body.assignedTo)) {
                return res.status(400).json({ message: "assignedTo must be an array of user IDs" });
            }
            task.assignedTo = req.body.assignedTo || task.assignedTo
        }
        const updatedTask = await task.save()
        res.status(200).json({ message: "Task updated successfully", updatedTask })


    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message })
    }
}

export const deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id)
        if (!task) {
            return res.status(404).json({ message: "Task not found" })
        }
        await task.deleteOne()
        res.status(200).json({ message: "Task deleted successfully" })

    } catch (error) {
        res.status(500).json({ message: "Server Error" })
    }
}

export const updateTaskStatus = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id)
        if (!task) {
            return res.status(404).json({ message: "Task not found" })
        }
        const isAssigned = task.assignedTo.includes(req.user._id)
        if (!isAssigned && req.user.role !== "admin") {
            return res.status(403).json({ message: "You are not authorized to update this task status" })
        }
        task.status = req.body.status || task.status
        if (req.body.status === "completed") {
            task.todoChecklist.forEach(item => {
                item.completed = true
            })
            task.progress = 100
        }


        await task.save()
        res.status(200).json({ message: "Task status updated successfully", task })


    } catch (error) {
        res.status(500).json({ message: "Server Error" })
    }
}
export const updateTaskChecklist = async (req, res) => {
    try {
        const { todoChecklist } = req.body
        if (!todoChecklist) {
            return res.status(400).json({ message: "todoChecklist is required" })
        }
        const task = await Task.findById(req.params.id)
        if (!task) {
            return res.status(404).json({ message: "Task not found" })
        }

        const isAssigned = task.assignedTo.some(id => id.equals(req.user._id));

        if (!isAssigned && req.user.role !== "admin") {

            return res.status(403).json({ message: "You are not authorized to update this task checklist" });
        }
        task.todoChecklist = todoChecklist
        const completedCount = task.todoChecklist?.filter(item => item.completed).length;
        const totalItems = task.todoChecklist?.length;
        task.progress = totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0


        if (task.progress === 100) {
            task.status = "completed"
        } else if (task.progress > 0) {
            task.status = "In Progress"
        } else { task.status = "pending" }

        await task.save()
        const updatedTask = await Task.findById(req.params.id).populate(
            "assignedTo",
            "name email profileImage"
        )
        res.json({ message: "task checklist updated ", task: updatedTask })



    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message })
    }
}
export const getDashboardData = async (req, res) => {
    try {

        const totalTasks = await Task.countDocuments()
        const pendingTasks = await Task.countDocuments({ status: "pending" })
        const inProgressTasks = await Task.countDocuments({ status: "In Progress" })
        const completedTasks = await Task.countDocuments({ status: "completed" })
        const overdueTasks = await Task.countDocuments({
            status: { $ne: "completed" },
            dueDate: { $lt: new Date() }
        })




        // for task distribution chart
        const taskStatuses = ["pending", "In Progress", "completed"]
        const taskDistributionRaw = await Task.aggregate([
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 }
                }
            }
        ])

        const taskDistribution = taskStatuses.reduce((acc, status) => {
            const formattedKey = status.toLocaleLowerCase().replace(/\s+/g, "")
            acc[formattedKey] = taskDistributionRaw.find(item => item._id === status)?.count || 0
            return acc

        }, {})
        taskDistribution["all"] = totalTasks



        // for task priority level 


        const taskPriorities = ["low", "medium", "high"]
        const taskPrioritiesRaw = await Task.aggregate([
            {
                $group: {
                    _id: "$priority",
                    count: { $sum: 1 }
                }

            }
        ])
        const taskPrioritiesLevel = taskPriorities.reduce((acc, priority) => {
            acc[priority]
            taskPrioritiesRaw.find((item) => item._id === priority?.count || 0)
            return acc
        }, {})



        // fetch only 10 tasks 
        const recentTasks = await Task.find().sort({ createdAt: -1 }).limit(10).select("title status priority dueDate createdAt")

        res.status(200).json({
            statistics: {
                totalTasks,
                pendingTasks,
                completedTasks
                , overdueTasks
            },
            charts: {
                taskDistribution,
                taskPrioritiesLevel
            },
            recentTasks
        })





    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message })
    }
}
export const getUserDashboardData = async (req, res) => {
    try {
        const userId = req.user._id

        const totalTasks = await Task.countDocuments({ assignedTo: userId })
        const pendingTasks = await Task.countDocuments({ assignedTo: userId, status: "pending" })
        const inProgressTasks = await Task.countDocuments({ assignedTo: userId, status: "In Progress" })
        const completedTasks = await Task.countDocuments({ assignedTo: userId, status: "completed" })
        const overdueTasks = await Task.countDocuments({
            assignedTo: userId,
            status: { $ne: "completed" },
            dueDate: { $lt: new Date() }
        })




        // for task distribution chart
        const taskStatuses = ["pending", "In Progress", "completed"]
        const taskDistributionRaw = await Task.aggregate([
            {
                $match: { assignedTo: userId }
            },
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 }
                }
            }
        ])
        const taskDistribution = taskStatuses.reduce((acc, status) => {
            const formattedKey = status.toLocaleLowerCase().replace(/\s+/g, "")
            acc[formattedKey] = taskDistributionRaw.find(item => item._id === status)?.count || 0
            return acc

        }, {})
        taskDistribution["all"] = totalTasks


        const taskPriorities = ["low", "medium", "high"]
        const taskPrioritiesRaw = await Task.aggregate([
            {
                $match: { assignedTo: userId }
            },
            {
                $group: {
                    _id: "$priority",
                    count: { $sum: 1 }
                }
            }
        ])


        const taskPrioritiesLevel = taskPriorities.reduce((acc, priority) => {
            acc[priority] = taskPrioritiesRaw.find(item => item._id === priority)?.count || 0
            return acc
        }, {})
        // fetch only 10 tasks 
        const recentTasks = await Task.find({ assignedTo: userId }).sort({ createdAt: -1 }).limit(10).select("title status priority dueDate createdAt")

        res.status(200).json({
            statistics: {
                totalTasks,
                pendingTasks,
            },
            charts: {
                taskDistribution,
                taskPrioritiesLevel
            },
            recentTasks
        })
    } catch (error) {
        res.status(500).json({ message: "Server Error" })
    }
}




