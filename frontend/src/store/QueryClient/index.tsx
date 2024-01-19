import { QueryClient } from "react-query"
import axios from "axios"

export const queryClient = new QueryClient()
export const api = axios.create({
  baseURL: "http://localhost:8000/",
  withCredentials: true,
})
