import ThemeButton from "../../components/etc/ThemeButton"
import { useTheme } from "../../lib/contexts/ThemeContext"

const LoginPage = () => {
    const {setTheme} = useTheme()

  return (
    <div className="full-page relative">
        <div className="w-80 flex flex-col item-center">
            <h3>Sign In</h3>
            <button onClick={() => setTheme((theme) => (theme === "light") ? "dark" : "light")}>lol</button>
        </div>
        <div className="absolute top-5 right-5">
          <ThemeButton />
        </div>
    </div>
  )
}

export default LoginPage