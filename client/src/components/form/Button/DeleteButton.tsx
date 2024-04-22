import { Tooltip } from '@mui/material';
import React from 'react'
import { RiDeleteBin6Line } from "react-icons/ri";

const DeleteButton = ({onClick, id} : {onClick: () => void, id?: string}) => {
  return (
    <Tooltip title="Delete">
      <button id={(id) ? id : Date.now().toFixed(0)} type="button" onClick={onClick} className="p-1 rounded-md transition-colors hover:bg-red-200 dark:hover:bg-slate-700">
          <RiDeleteBin6Line className="w-4 h-4" />
      </button>
    </Tooltip>
    
  )
}

export default DeleteButton