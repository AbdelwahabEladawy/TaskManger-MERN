import mongoose from "mongoose";



const todoSchema = new mongoose.Schema({
    text: { type: String, required: true },
    completed: { type: Boolean, required: true, default: false },

})

const TaskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
    status: { type: String, enum: ["pending", "In Progress", "completed"], default: "pending" },
    dueDate: { type: Date, required: true },
    assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    attachment: [{ type: String }],
    todoChecklist: [todoSchema],
    progress: { type: Number, default: 0 },

}, { timestamps: true })


export default mongoose.model(
    "Task",
    TaskSchema
)