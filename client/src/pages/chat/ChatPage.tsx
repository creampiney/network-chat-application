import { Navigate } from "react-router-dom"
import { useUser } from "../../lib/contexts/UserContext"
import LoadingPage from "../etc/LoadingPage"
import Sidebar from "../../components/sidebar/Sidebar"


const ChatPage = () => {

  const {currentUser, isLoading} = useUser()


  if (isLoading) return <LoadingPage />

  if (!currentUser) return <Navigate to="/" replace={true} />

  return (
    <div className="full-page flex-row">
      <Sidebar />
      <div className="grow h-full bg-slate-400">

      </div>
    </div>
  )
}

export default ChatPage