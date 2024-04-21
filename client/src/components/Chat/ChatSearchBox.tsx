import React from 'react'
import { IoSearch } from 'react-icons/io5'

const ChatSearchBox = ({value, onChange}: {value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void}) => {
  return (
    <div className="w-full h-16 bg-slate-100 dark:bg-slate-800 flex items-center justify-center px-5 py-2">
        <div className="relative flex flex-col w-full">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <IoSearch className="text-xl fond-bold text-indigo-600 dark:text-indigo-300"/>
            </div>    
            <input 
                type="text" 
                className="input input-bordered input-sm ps-10 bg-gray-50 border border-gray-300 text-gray-900 w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white py-1.5 px-4" 
                placeholder="Search Name..."
                value={value}
                onChange={onChange}
             />
        </div>
    </div>
  )
}

export default ChatSearchBox