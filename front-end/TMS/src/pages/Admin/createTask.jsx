import React, { useState } from 'react'
import DashboardLayout from '../../components/layouts/dashboardLayout/DashboardLayout'
import { PRIORITY_DATA } from '../../utils/data'
import moment from 'moment'
import { API_PATHS } from '../../utils/apiPaths'
import axiosInstance from '../../utils/axoisInstance'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { LuTrash2 } from 'react-icons/lu'
import SelectDropDown from '../../components/SelectDropDown/SelectDropDown'
import SelectUsers from '../../components/SelectUsers/SelectUsers'

export default function CreateTask() {
    const location = useLocation();
    const navigate = useNavigate();
    const { taskId } = location.state || {};
    const [taskData, setTaskData] = useState({
        title: "",
        description: "",
        priority: "",
        dueDate: null,
        assignedTo: [],
        attachment: [],
        todoChecklist: []

    });

    const [currentTask, setCurrentTask] = useState("");
    const [loading, setLoading] = useState(false);
    const [openDeleteAlert, setOpenDeleteAlert] = useState(false);

    const handleValueChange = (key, value) => {
        setTaskData((pervData) => ({ ...pervData, [key]: value }))
    }

    const clearData = () => {
        setTaskData({
            title: "",
            description: "",
            priority: "low",
            dueDate: null,
            assignedTo: [],
            attachment: [],
            todoChecklist: []
        })
    }

    const createTask = async (params) => { }
    const updateTask = async (params) => { }
    const handleSubmit = async (params) => { }


    const getTaskDetailsByDetails = async () => { }
    const deleteTask = async () => { }

    return (
        <DashboardLayout >
            <div className="mt-5">
                <div className="flex flex-col justify-center  ">
                    <div className="form-card col-span-3">

                        <div className="flex items-center justify-between">
                            <h2 className='text-xl font-semibold '>{taskId ? "Update Task" : "Create Task"}</h2>
                            {taskId && (
                                <button className="text-rose-500 flex items-center gap-1.5 text-[13px] bg-rose-50 rounded px-2 py-1 border border-rose-100 hover:bg-rose-300 cursor-pointer"
                                    onClick={() => { setOpenDeleteAlert(true) }}>
                                    <LuTrash2 className='text-base' /> Delete
                                </button>)}
                        </div>
                    </div>

                    <div className='mt-4'>
                        <label className="text-xs font-medium text-slate-600">Task Title</label>
                        <input
                            className='form-input'
                            placeholder='Create App uI'
                            onChange={({ target }) => {
                                handleValueChange("title", target.value)
                            }}
                        />
                    </div>
                    <div className='mt-3'>
                        <label className="text-xs font-medium text-slate-600">Description </label>
                        <textarea placeholder='Describe task' className='form-input' rows={4} value={taskData.description} onChange={({ target }) => { handleValueChange("description", target.value) }}></textarea>

                    </div>

                    <div className="flex gap-2 flex-col sm:flex-row">
                        <div className='sm:w-1/2 '>
                            <label className="text-xs font-medium text-slate-600">priority </label>
                            <SelectDropDown
                                options={PRIORITY_DATA}
                                onChange={({ target }) => { handleValueChange("priority", target.value) }}
                                value={taskData.priority}
                                placeholder="Select Priority"

                            />
                        </div>
                        <div className='sm:w-1/2 '>
                            <label className="text-xs font-medium text-slate-600">due date </label>
                            <input
                                placeholder='Create App UI '
                                type="date"
                                value={taskData.dueDate}
                                className='form-input'
                                onChange={({ target }) => {
                                    handleValueChange("dueDate", target.value)
                                }}
                            />
                        </div>
                    </div>



                    <div>
                        <label className="text-xs font-medium text-slate-600">Assign To  </label>
                        <SelectUsers
                            selectUser={taskData.assignedTo}
                                setSelectUser={(value)=>{handleValueChange("assignedTo",value)}}
                            />
                    </div>




                </div>
            </div>
        </DashboardLayout>
    )
}
