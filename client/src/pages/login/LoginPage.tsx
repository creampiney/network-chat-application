import { useEffect, useState } from "react"
import ThemeButton from "../../components/etc/ThemeButton"
import { Link, Navigate } from "react-router-dom"
import { useUser } from "../../lib/contexts/UserContext"

const LoginPage = () => {

  const [username, setUsername] = useState<string>("")
  const [password, setPassword] = useState<string>("")

  const [isError, setError] = useState<boolean>(false)

  const {currentUser, isLoading} = useUser()

  async function onSubmit() {
    setError(false)

    try {
      const result = await fetch(import.meta.env.VITE_BACKEND_URL + '/auth/login',{
        method : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body : JSON.stringify({
            username : username,
            password : password
        }),
        credentials : 'include',
      });
      if (result.ok) {
        window.location.href = "/chat"
      }
      else {
        setError(true)
      }

    } catch (err) {
      setError(true)
    }
  }

  useEffect(() => {
    window.document.title = "Sign In"
  }, [])

  if (isLoading) return <div className="full-page"></div>

  if (currentUser) return <Navigate to="/chat" replace={true} /> 

  return (
    <div className="full-page relative">
        <div className="w-80 flex flex-col item-center">
            <form className="w-full flex flex-col items-center gap-3" onSubmit={(e) => {e.preventDefault(); onSubmit();}}>
              <h2>Sign In</h2>
              {
                  isError && <div className="flex w-full justify-center text-red-700 dark:text-red-400">Email or password is wrong!</div>
              }
              <div className="w-full flex flex-col gap-2">
                  <label className="text-base">Username</label>
                  <input 
                      type="text" 
                      placeholder="Username..." 
                      className="primary-input"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}/>
              </div>
              <div className="w-full flex flex-col gap-2">
                  <label className="text-base">Password</label>
                  <input 
                      type="password" 
                      placeholder="Password..." 
                      className="primary-input"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}/>
              </div>
              <span>Don't have an account? <Link to="/register">Sign up</Link> now!</span>
              <button type="submit" className="primary-button">Sign In</button>
            </form>
          
        </div>
        <div className="absolute top-5 right-5">
          <ThemeButton />
        </div>
    </div>
  )
}

export default LoginPage