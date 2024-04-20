import React from 'react'
import ThemeButton from '../etc/ThemeButton'
import { useUser } from '../../lib/contexts/UserContext'
import { Avatar } from '@mui/material'

const Sidebar = () => {

    const {currentUser, isLoading} = useUser()

  return (
    <div className="w-20 h-full flex flex-col items-center justify-between">
        <div>Menu</div>
        <div className="w-full flex flex-col items-center gap-5 pb-5">
            <ThemeButton />
            {
                currentUser && (
                    <Avatar src={currentUser.avatar} sx={{ width: 48, height: 48 }} />
                )
            }
        </div>
    </div>
  )
}

export default Sidebar