import { FiMoon, FiSun } from 'react-icons/fi'
import { useTheme } from '../../lib/contexts/ThemeContext'

const ThemeButton = () => {

  const {theme, setTheme} = useTheme()

  return (
    <button onClick={() => setTheme((theme) => (theme === "light") ? "dark" : "light")}>
        {
          (theme === "light") ? <FiSun className="w-6 h-6" /> : <FiMoon className="w-6 h-6" />
        }
    </button>
  )
}

export default ThemeButton