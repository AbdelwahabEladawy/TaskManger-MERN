import React, { useEffect, useState } from 'react'
import DashboardLayout from '../../components/layouts/dashboardLayout/DashboardLayout'
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axoisInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { LuFileSpreadsheet } from 'react-icons/lu';
import TaskStatusTabs from '../../components/TaskStatusTabs/TaskStatusTabs';
import TaskCard from '../../components/TaskCard/TaskCard';

export default function ManageTasks() {
    const [allTasks, setAllTasks] = useState([]);
    const [filterStatus, setFilterStatus] = useState("All");
    const [tabs, setTabs] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const STATUS_QUERY_MAP = {
        All: "",
        Pending: "pending",
        "In Progress": "In Progress",
        Completed: "completed"
    };

    const normalizeTaskPayload = (task) => {
        const attachments = task.attachment ?? task.attachments ?? [];
        const todoChecklist = Array.isArray(task.todoChecklist) ? task.todoChecklist : [];
        const completedTodoCount =
            typeof task.completedTodoCount === "number"
                ? task.completedTodoCount
                : todoChecklist.filter((item) => item.completed).length;

        const derivedProgress =
            typeof task.progress === "number" && task.progress > 0
                ? task.progress
                : todoChecklist.length > 0
                    ? Math.round((completedTodoCount / todoChecklist.length) * 100)
                    : 0;

        return {
            ...task,
            _attachmentCount: attachments.length,
            _todoChecklist: todoChecklist,
            _completedTodoCount: completedTodoCount,
            _progress: derivedProgress,
        };
    };

    const getAllTasks = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(API_PATHS.TASKS.GET_ALL, {
                params: {
                    status: STATUS_QUERY_MAP[filterStatus] ?? ""
                }
            });

            const taskList = response.data?.tasks?.length > 0 ? response.data.tasks : [];
            setAllTasks(taskList.map(normalizeTaskPayload));

            const summary = response.data?.summary || {};

            const statusSummary = {
                all: summary.all || 0,
                pending: summary.pendingTasks || 0,
                inprogress: summary.inProgressTasks || 0,
                completed: summary.completedTasks || 0,
            };

            const statusArray = [
                { label: "All", count: statusSummary.all },
                { label: "Pending", count: statusSummary.pending },
                { label: "In Progress", count: statusSummary.inprogress },
                { label: "Completed", count: statusSummary.completed },
            ];

            setTabs(statusArray);

        } catch (error) {
            console.error("Error fetching tasks:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleClick = (taskData) => {
        navigate(`/admin/create-task/${taskData._id}`);
    };

    

    const handleDownloadReport = async () => {
            try {
                const response = await axiosInstance.get(API_PATHS.REPORTS.EXPORT_TASKS, {
                    responseType: "blob",
                });
    
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", "task_details.xlsx");
                document.body.appendChild(link);
                link.click();
                link.parentNode.removeChild(link);
                window.URL.revokeObjectURL(url);
            } catch (error) {
                console.error("Error downloading expense details:", error);
                toast.error("Failed to download expense details. Please try again.");
            }
        };

    useEffect(() => {
        getAllTasks();
    }, [filterStatus]);

    return (
        <DashboardLayout>
            <div className="my-5">
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div className="flex items-center gap-3 justify-between w-full">
                        <h2 className='text-xl md:text-xl font-medium'>
                            My Tasks
                        </h2>

                        <button className='flex download-btn' onClick={handleDownloadReport}>
                            <LuFileSpreadsheet className='text-lg' />
                            Download Report
                        </button>
                    </div>
                </div>

                {tabs.length > 0 && (
                    <div className='flex items-center gap-3'>
                        <TaskStatusTabs
                            tabs={tabs}
                            activeTab={filterStatus}
                            setActiveTab={setFilterStatus}
                        />
                    </div>
                )}


                {allTasks.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 mt-4 gap-4">
                        {allTasks.map((item) => (
                            <TaskCard
                                key={item._id}
                                title={item.title}
                                description={item.description}
                                priority={item.priority}
                                status={item.status}
                                progress={item._progress}
                                createdAt={item.createdAt}
                                dueDate={item.dueDate}
                                assignedTo={item.assignedTo}
                                attachmentCount={item._attachmentCount}
                                completedTodoCount={item._completedTodoCount}
                                todoChecklist={item._todoChecklist}
                                onClick={() => handleClick(item)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="mt-10 rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
                        {loading ? "loading ...." : "No tasks found"}
                    </div>
                )}

            </div>
        </DashboardLayout>
    );
}
