import React, { useState, useEffect } from 'react'
import DashboardLayout from '../../components/layouts/dashboardLayout/DashboardLayout'
import { PRIORITY_DATA } from '../../utils/data'
import { API_PATHS } from '../../utils/apiPaths'
import axiosInstance from '../../utils/axoisInstance'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { LuTrash2 } from 'react-icons/lu'
import SelectDropDown from '../../components/SelectDropDown/SelectDropDown'
import SelectUsers from '../../components/SelectUsers/SelectUsers'
import TodoListInput from '../../components/TodoListInput/TodoListInput'
import AddAttachmentsInput from '../../components/AddAttachmentsInput/AddAttachmentsInput'

export default function CreateTask() {
    const location = useLocation();
    const navigate = useNavigate();
    const { taskId } = location.state || {}; // لو جاي عشان تعدل تاسك

    const [taskData, setTaskData] = useState({
        title: "",
        description: "",
        priority: "medium", // Default value
        dueDate: "",
        assignedTo: [],
        attachment: [],
        todoChecklist: []
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [openDeleteAlert, setOpenDeleteAlert] = useState(false);

    // دالة تحديث القيم في الـ State
    const handleValueChange = (key, value) => {
        setTaskData((prevData) => ({ ...prevData, [key]: value }));
    }

    // دالة مسح البيانات بعد الإضافة
    const clearData = () => {
        setTaskData({
            title: "",
            description: "",
            priority: "medium",
            dueDate: "",
            assignedTo: [],
            attachment: [],
            todoChecklist: []
        });
    }

    // --- دالة الإنشاء (زي الصورة بالظبط) ---
    const createTask = async () => {
        setLoading(true);
        try {
            // تحويل الـ Checklist من نصوص لـ Objects عشان الباك إند
            const todolist = taskData.todoChecklist?.map((item) => ({
                text: item,
                completed: false,
            }));

            const response = await axiosInstance.post(API_PATHS.TASKS.CREATE, {
                ...taskData,
                dueDate: new Date(taskData.dueDate).toISOString(), // تنسيق التاريخ
                todoChecklist: todolist,
            });

            toast.success("Task Created Successfully");
            clearData();


        } catch (error) {
            console.error("Error creating task:", error);
            setError(error?.response?.data?.message || "Error creating task");
        } finally {
            setLoading(false);
        }
    };

    // --- دالة التحديث (Placeholder) ---
    const updateTask = async () => {
        // ممكن تضيف لوجيك التحديث هنا بنفس طريقة الإنشاء
        setLoading(true);
        try {
            const todolist = taskData.todoChecklist?.map((item) => {
                // لو هو string (جديد) حوله لاوبجكت، لو هو اوبجكت (قديم) سيبه زي ما هو
                return typeof item === 'string' ? { text: item, completed: false } : item
            });

            await axiosInstance.put(API_PATHS.TASKS.UPDATE_TASK(taskId), {
                ...taskData,
                dueDate: new Date(taskData.dueDate).toISOString(),
                todoChecklist: todolist,
            });
            toast.success("Task Updated Successfully");
            navigate('/admin/tasks');
        } catch (error) {
            setError(error?.response?.data?.message || "Error updating task");
        } finally {
            setLoading(false);
        }
    };

    // --- زرار الحفظ (Validation Logic) ---
    const handleSubmit = async () => {
        setError(null);

        // 1. تنظيف البيانات
        const title = taskData.title?.trim();
        const description = taskData.description?.trim();
        const priority = taskData.priority;
        const dueDate = taskData.dueDate;
        const assignedTo = taskData.assignedTo;
        const todoChecklist = taskData.todoChecklist;

        // 2. التحقق (Validation)
        if (!title) return setError("Task title is required");
        if (!description) return setError("Description is required");
        if (!priority) return setError("Priority is required");
        if (!dueDate) return setError("Due date is required");

        // التحقق من التاريخ (لا يمكن اختيار تاريخ قديم)
        const today = new Date().setHours(0, 0, 0, 0);
        const selected = new Date(dueDate).setHours(0, 0, 0, 0);
        if (selected < today) return setError("Due date cannot be in the past");

        if (!Array.isArray(assignedTo) || assignedTo.length === 0) {
            return setError("You must assign task to at least one user");
        }

        // 3. التنفيذ
        if (taskId) {
            await updateTask();
        } else {
            await createTask();
        }
    };

    // لو بنعدل تاسك، محتاجين نجيب بياناتها الأول
    useEffect(() => {
        if (taskId) {
            // هنا ممكن تعمل fetch لبيانات التاسك لو مش جاية مع الـ location
            // setTaskData({ ...taskDetails });
        }
    }, [taskId]);

    return (
        <DashboardLayout activeMenu="Create Task">
            <div className="mt-5">
                <div className="flex flex-col justify-center">
                    <div className="form-card col-span-3">

                        {/* Header */}
                        <div className="flex items-center justify-between">
                            <h2 className='text-xl font-semibold'>{taskId ? "Update Task" : "Create Task"}</h2>
                            {taskId && (
                                <button className="text-rose-500 flex items-center gap-1.5 text-[13px] bg-rose-50 rounded px-2 py-1 border border-rose-100 hover:bg-rose-300 cursor-pointer"
                                    onClick={() => { setOpenDeleteAlert(true) }}>
                                    <LuTrash2 className='text-base' /> Delete
                                </button>
                            )}
                        </div>

                        {/* Title Input */}
                        <div className='mt-4'>
                            <label className="text-xs font-medium text-slate-600">Task Title</label>
                            <input
                                className='form-input'
                                placeholder='Create App UI'
                                value={taskData.title}
                                onChange={({ target }) => handleValueChange("title", target.value)}
                            />
                        </div>

                        {/* Description Input */}
                        <div className='mt-3'>
                            <label className="text-xs font-medium text-slate-600">Description</label>
                            <textarea
                                placeholder='Describe task'
                                className='form-input'
                                rows={4}
                                value={taskData.description}
                                onChange={({ target }) => handleValueChange("description", target.value)}>
                            </textarea>
                        </div>

                        {/* Priority & Date */}
                        <div className="flex gap-2 flex-col sm:flex-row mt-3">
                            <div className='sm:w-1/2'>
                                <label className="text-xs font-medium text-slate-600">Priority</label>
                                <SelectDropDown
                                    options={PRIORITY_DATA}
                                    value={taskData.priority}
                                    onChange={(option) => handleValueChange("priority", option.value)}
                                    placeholder="Select Priority"
                                />
                            </div>
                            <div className='sm:w-1/2'>
                                <label className="text-xs font-medium text-slate-600">Due Date</label>
                                <input
                                    type="date"
                                    value={taskData.dueDate}
                                    className='form-input'
                                    onChange={({ target }) => handleValueChange("dueDate", target.value)}
                                />
                            </div>
                        </div>

                        {/* Assign Users */}
                        <div className="mt-3">
                            <label className="text-xs font-medium text-slate-600">Assign To</label>
                            <SelectUsers
                                selectedUsers={taskData.assignedTo}
                                setSelectedUsers={(value) => handleValueChange("assignedTo", value)}
                            />
                        </div>

                        {/* Checklist */}
                        <div className="mt-3">
                            <label className='text-xs font-medium text-slate-600'>To Do Checklist</label>
                            <TodoListInput
                                todoList={taskData.todoChecklist}
                                setTodoList={(value) => handleValueChange("todoChecklist", value)}
                            />
                        </div>

                        {/* Attachments */}
                        <div className="mt-3">
                            <label className='text-xs font-medium text-slate-600'>Add Attachments</label>
                            <AddAttachmentsInput
                                attachments={taskData.attachment} // تأكد إن الاسم هنا attachment زي الـ State
                                setAttachments={(value) => handleValueChange("attachment", value)}
                            />
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="text-xs text-rose-500 mt-5 font-medium">
                                {error}
                            </div>
                        )}

                        {/* Submit Button */}
                        <div className="flex justify-end mt-7">
                            <button
                                className='card-btn bg-primary text-white px-6 py-2 rounded-md disabled:bg-gray-300'
                                onClick={handleSubmit}
                                disabled={loading}
                            >
                                {loading ? "Saving..." : (taskId ? "Update Task" : "Create Task")}
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}