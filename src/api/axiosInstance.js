import axios from "axios"
const gameInstance = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    headers:{
        "Content-type" : "application/json"
    },
    timeout : 5000
})

export const authInstance = axios.create({
    baseURL: import.meta.env.VITE_AUTH_URL,
    headers:{
        "Content-type" : "application/json"
    },
    timeout : 5000
})

export default gameInstance