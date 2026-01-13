import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { API_PATHS } from '../../utils/apiPaths';
import axiosInstance from '../../utils/axoisInstance';
import DashboardLayout from '../../components/layouts/dashboardLayout/DashboardLayout';
import InfoCard from '../../components/cards/InfoCard';
import moment from 'moment';
import { LuSquareArrowOutUpRight } from 'react-icons/lu';

export default function ViewTaskDetails() {

    const { id } = useParams();
    const [task, setTask] = useState(null);
    const [filterStatus, setFilterStatus] = useState("All");



    const getStatusTagColor = (status) => {
        switch (status) {
            case "In Progress":
                return "text-cyan-500 bg-cyan-50 border border-cyan-500/10";

            case "completed":
                return "text-lime-500 bg-lime-50 border border-lime-500/20";

            default:
                return "text-violet-500 bg-violet-50 border border-violet-500/10";
        }
    }

    const getTaskDetailsById = async () => {
        try {
            const response = await axiosInstance.get(API_PATHS.TASKS.GET_BY_ID(id));
            if (response.data) {
                setTask(response.data);
            }

        } catch (error) {
            console.log("Error Fetching Task", error);

        }
    };

    const updateTodoChecklist = async (index) => {

        const todoChecklist = [...task.todoChecklist];
        const taskId = id;
        if (todoChecklist&& todoChecklist[index]) {
            todoChecklist[index].completed = !todoChecklist[index].completed;
            try {
                const response = await axiosInstance.put(API_PATHS.TASKS.UPDATE_CHECKLIST(taskId), { todoChecklist });
             
                if (response.status===200) {
                    setTask(response.data.task)|| task;
                } else {
                    todoChecklist[index].completed = !todoChecklist[index].completed; 
                }
            
           } catch (error) {
            console.log("Error Fetching Task", error);  
           }
        }
    }

    const handleLinkClick = (link) => {
        if (!/^https?:\/\//i.test(link)) {
            link = `https://` + link
        }
        window.open(link, '_blank');
    }

    useEffect(() => {
        getTaskDetailsById();

        return () => { }
    }, [id]);


    return (
        <DashboardLayout>
            <div className="mt-5">
                {task && <div className="grid grid-cols-1  mt-4">
                    <div className="form-card col-span-3">
                        <div className="flex justify-between items-center">
                            <h1 className='text-xl md:text-xl font-medium' >{task?.title}</h1>
                            <div className={`text=[13px] font-medium ${getStatusTagColor(task?.status)} px-4 py-0.5 rounded`}>
                                {task?.status}
                            </div>
                        </div>


                        <div className='mt- ms-2'>

                            <Infobox label="Description" value={task?.description}></Infobox>
                        </div>

                        <div className='mt-2 ms-2'>

                            <Infobox label="Priority" value={task?.priority}></Infobox>
                        </div>
                        <div className='mt-2 ms-2'>

                            <Infobox label="due date" value={task?.dueDate ? moment(task?.dueDate).format("DD-MM-YYYY") : null}></Infobox>
                        </div>
                        <Infobox
                            label="Assigned To"
                            value={
                                task?.assignedTo?.length
                                    ? task.assignedTo.map(user => user.name).join(", ")
                                    : "Not assigned"
                            }
                        />
                        <div className="mt-2">
                            <label className='text-xs md:text-[14px]  font-bold text-cyan-800'>
                                Todo Checklist
                            </label>

                            {
                                task?.todoChecklist?.map((todo, index) => (
                                    <TodoChecklist
                                        key={`todo-${index}`}
                                        text={todo.text}
                                        isChecked={todo.completed}
                                        onChange={() => updateTodoChecklist(index)}
                                    >
                                    </TodoChecklist>
                                ))
                            }

                        </div>

                        <label className='text-xs md:text-[14px]  font-bold text-cyan-800'>
                            Attachments
                        </label>

                        {
                            task?.attachment?.map((link, index) => (
                                <Attachment
                                    key={`link_${index}`}
                                    link={link}
                                    index={index}
                                    onClick={() => handleLinkClick(link)}

                                >
                                </Attachment>
                            ))
                        }



                    </div>


                </div>}
            </div>



        </DashboardLayout>
    )
}



const Infobox = ({ icon, label, value, color }) => {
    return (
        <div>
            <div className={`flex items-start flex-col  gap-3`}>
                <div className={`w-2 h-2 md:w-3  md:h-3 ${color} rounded-full`} />
                <p className="text-xs md:text-[14px]  font-bold text-cyan-800">{label}</p>
                <p className="text-sm  md:text-[12px] font- text-gray-700  " >{value}</p>
            </div>
        </div>
    )
}




const TodoChecklist = ({ text, isChecked, onChange }) => {
    return (
        <div className="flex items-center gap-3 p-3">
            <input
                type="checkbox"
                checked={isChecked}
                onChange={onChange}
                className="w-4 h-4 cursor-pointer"
            />
            <p className={`text-[13px] ${isChecked ? "line-through text-gray-400" : "text-gray-800"}`}>
                {text}
            </p>
        </div>
    );
};



const Attachment = ({ link, index, onClick }) => {
    return (
        <div className="flex flex-wrap items-center gap-3  ">
            <span className='text-xs text-gray-400 font-semibold mr-2'>
                {index < 9 ? `0${index + 1}` : index + 1}
            </span>
            <p className='text-xs text-black'>{link}</p>
            <LuSquareArrowOutUpRight className="text-xs cursor-pointer text-gray-400" onClick={onClick} />
        </div>
    );
};
