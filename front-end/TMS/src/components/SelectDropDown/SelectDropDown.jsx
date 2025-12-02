import React, { useState } from 'react'
import { LuChevronDown } from 'react-icons/lu'

function SelectDropDown({ options, onChange, value, placeholder }) {
    const [isOpen, setIsOpen] = useState(false)
    const handleSelect = (option) => {
        onChange(option)
        setIsOpen(false)
    }
    return (
        <div className='relative w-full '>
            <button onClick={() => { setIsOpen(!isOpen) }}
                className='w-full text-sm text-black outline-none bg-white rounded-md px-2.5 py-3  mt-2 border  border-slate-100 flex items-center justify-between'

            >
                {value ? options.find((opt) => opt.value === value)?.label : placeholder}
                <span className=''>{isOpen ? <LuChevronDown className='rotate-180' /> : <LuChevronDown />} </span>

            </button>


            {isOpen && (
                <div className='absolute top-full left-0 w-full bg-white border border-slate-100 rounded-md mt-1 shadow-md  z-10  '>
                    {options.map((option) => (
                        <div key={option.value} onClick={() => { handleSelect(option) }} className='px-3 py-2 text-sm  cursor-pointer hover:bg-gray-100 '>
                            {option.label}
                        </div>
                    ))}
                </div>
            )}




        </div>
    )
}

export default SelectDropDown
