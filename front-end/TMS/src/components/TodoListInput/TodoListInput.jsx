import React, { useState } from 'react';
import { HiMiniPlus, HiOutlineTrash } from "react-icons/hi2";

function TodoListInput({ todoList, setTodoList }) {
    const [option, setOption] = useState("");

    // Function to handle adding an option
    const handleAddOption = () => {
        if (option.trim()) {
            setTodoList([...todoList, option.trim()]);
            setOption("");
        }
    };

    // Function to handle deleting an option
    const handleDeleteOption = (index) => {
        const updatedArr = todoList.filter((_, idx) => idx !== index);
        setTodoList(updatedArr);
    };

    return (
        <div className='flex flex-col gap-2'>
 
            {todoList.map((item, index) => (
                <div key={item + index} className="flex items-center justify-between p-2 border rounded-md border-gray-100">
                    <p className="text-sm text-gray-700 flex items-center gap-2">
              
                        <span className="text-gray-400 font-medium">
                            {index < 9 ? `0${index + 1}` : index + 1}
                        </span>
                        {item}
                    </p>

                    <button
                        className="cursor-pointer hover:bg-red-50 p-1 rounded-full transition-all"
                        onClick={() => handleDeleteOption(index)}
                    >
                        <HiOutlineTrash className="text-lg text-red-500" />
                    </button>
                </div>
            ))}


            <div className="flex items-center gap-5 mt-4">
                <input
                    type="text"
                    placeholder="Enter Task"
                    value={option}
                    onChange={({ target }) => setOption(target.value)}
                    className="w-full text-[13px] text-black outline-none bg-transparent border border-gray-300 px-3 py-2 rounded placeholder:text-slate-400"
                />

                <button
                    className="card-btn text-nowrap flex items-center gap-1 bg-primary text-white px-4 py-2 rounded text-sm"
                    onClick={handleAddOption}
                >
                    <HiMiniPlus className="text-lg" /> Add
                </button>
            </div>
        </div>
    );
}

export default TodoListInput;