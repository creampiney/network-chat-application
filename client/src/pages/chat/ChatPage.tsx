import { Navigate } from "react-router-dom"
import { useUser } from "../../lib/contexts/UserContext"
import LoadingPage from "../etc/LoadingPage"
import Sidebar from "../../components/sidebar/Sidebar"
import Home from "../../components/home/Home"


const ChatPage = ({current}: {current?: string}) => {

  const {currentUser, isLoading} = useUser()


  if (isLoading) return <LoadingPage />

  if (!currentUser) return <Navigate to="/" replace={true} />

  return (
    <div className="full-page flex-row">
      <Sidebar current={current} />
      <div className="grow h-full overflow-y-auto">
        {
          (current === "home") && <Home />
        }
      </div>
    </div>
  )
}

export default ChatPage