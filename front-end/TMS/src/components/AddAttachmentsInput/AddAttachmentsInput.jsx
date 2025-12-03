import { HiMiniPlus, HiOutlineTrash } from "react-icons/hi2";
import { useState } from 'react';
import { LuPaperclip } from "react-icons/lu";

function AddAttachmentsInput({ attachments, setAttachments }) {
    const [option, setOption] = useState("")

    const handleAddOptions = () => {
        if (option.trim()) {
            setAttachments([...attachments, option.trim()])
            setOption("")
        }
    }

    const handleDeleteOption = (index) => {
        const updatedArr = attachments.filter((_, idx) => idx !== index)
        setAttachments(updatedArr)
    }

    return (
        <div className="flex flex-col gap-2">
            {/* List of Attachments */}
            {attachments.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-2 border rounded-md border-gray-100 bg-gray-50/50">
                    <div className="flex items-center gap-3">
                        {/* File Icon & Number */}
                        <div className="flex items-center justify-center w-8 h-8 bg-blue-100/50 rounded-full text-primary">
                            <LuPaperclip className="text-sm" />
                        </div>

                        <div className="flex flex-col">
                            <span className="text-[10px] text-gray-400 font-medium">
                                {index < 9 ? `0${index + 1}` : index + 1}
                            </span>
                            <p className="text-sm text-gray-700 truncate max-w-[200px] md:max-w-[300px]">
                                {item}
                            </p>
                        </div>
                    </div>

                    <button
                        className="cursor-pointer hover:bg-red-50 p-1.5 rounded-full transition-all"
                        onClick={() => handleDeleteOption(index)}
                    >
                        <HiOutlineTrash className="text-lg text-red-500" />
                    </button>
                </div>
            ))}

            {/* Input Field */}
            <div className="flex items-center gap-3 mt-2">
                <div className="relative w-full">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <LuPaperclip className="text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Paste File URL / Name"
                        value={option}
                        onChange={({ target }) => setOption(target.value)}
                        className="w-full text-[13px] text-black outline-none bg-transparent border border-gray-300 pl-9 pr-3 py-2 rounded placeholder:text-slate-400 focus:border-primary transition-colors"
                    />
                </div>

                <button
                    className="card-btn text-nowrap flex items-center gap-1 bg-primary text-white px-4 py-2 rounded text-sm hover:bg-primary/90 transition-all"
                    onClick={handleAddOptions}
                >
                    <HiMiniPlus className="text-lg" /> Add
                </button>
            </div>
        </div>
    )
}

export default AddAttachmentsInput