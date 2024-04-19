import { useState } from "react"
import ThemeButton from "../../components/etc/ThemeButton"
import { Link } from "react-router-dom"

const LoginPage = () => {

  const [username, setUsername] = useState<string>("")
  const [password, setPassword] = useState<string>("")

  const [isError, setError] = useState<boolean>(false)

  return (
    <div className="full-page relative">
        <div className="w-80 flex flex-col item-center">
            <form className="w-full flex flex-col items-center gap-3" onSubmit={(e) => {e.preventDefault()}}>
              <h2>Sign In</h2>
              {
                  isError && <div className="flex w-full justify-center text-red-700">Email or password is wrong!</div>
              }
              <div className="w-full flex flex-col gap-2">
                  <label className="text-base">Username</label>
                  <input 
                      type="text" 
                      placeholder="Email..." 
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