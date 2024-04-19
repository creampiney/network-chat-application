import { createContext, useContext, useEffect, useState } from "react";

export const ThemeContext = createContext<{theme: string, setTheme: React.Dispatch<React.SetStateAction<string>>}>({theme: "light", setTheme: () => {}});

export const ThemeProvider = ({children} : {children : React.ReactNode}) => {
    const [theme, setTheme] = useState<string>("light");

    useEffect(() => {
        document.body.classList.remove('light', 'dark')
        document.body.classList.add(theme)
        console.log(theme)
    }, [theme])
    
    return (<ThemeContext.Provider value = {{theme, setTheme}}>
        {children}
    </ThemeContext.Provider>);
};

export const useTheme = () => {return useContext(ThemeContext)}