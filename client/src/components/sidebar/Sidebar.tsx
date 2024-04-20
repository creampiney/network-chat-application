import ThemeButton from '../etc/ThemeButton'
import { useUser } from '../../lib/contexts/UserContext'
import { Avatar } from '@mui/material'
import { IoHomeOutline } from 'react-icons/io5'
import { LuMessagesSquare } from 'react-icons/lu'
import { GrGroup } from 'react-icons/gr'
import { useNavigate } from 'react-router-dom'

const Sidebar = ({current}: {current?: string}) => {

    const navigate = useNavigate();

    const {currentUser} = useUser()


    const menu = [
        {
            icon: <IoHomeOutline />,
            path: "/chat",
            name: "home"
        },
        {
            icon: <LuMessagesSquare />,
            path: "/chat/rooms",
            name: "rooms"
        },
        {
            icon: <GrGroup />,
            path: "/chat/groups",
            name: "groups"
        }
    ]

    return (
    <div className="w-16 h-full flex flex-col items-center justify-between">
        <div className="w-full flex flex-col items-center">
            {
                menu.map((data, idx) => {
                    return (
                        <button 
                            key={idx} 
                            className={"relative w-16 h-16 aspect-square flex flex-col items-center justify-center text-xl hover:bg-slate-100 dark:hover:bg-slate-800 " + ((current === data.name) && "text-indigo-500")}
                            onClick={() => {if (current !== data.name) navigate(data.path)}}
                        >
                            {data.icon}
                            {
                                (current === data.name) && <div className="absolute left-0 h-full w-1.5 bg-indigo-500"></div>
                            }
                        </button>
                    )
                })
            }
        </div>
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