import { User } from "./types/User";

export default async function getUser() : Promise<User | null>{
    const jwt = await fetch(import.meta.env.VITE_BACKEND_URL + "/auth/user",{
            method : "GET",
            credentials : "include"
        })
        if (jwt.status === 200){
            const data: User = await jwt.json();
            return data
        }
        if (jwt.status === 401){
            console.log(jwt);
            console.log("NOT OK");
        }
    
    
    
    return null;
    
}