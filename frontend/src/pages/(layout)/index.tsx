import { useContext } from "react"
import { Routes, Route } from "react-router-dom"
import { useMutation, useQuery } from "react-query"
import Cookies from "js-cookie"

import { api } from "../../store/QueryClient"
import { GlobalStateContext } from "../../store/GlobalStateProvider"
import ProductsProvider from "../../store/ProductsProvider"

import NavMenu from "./NavMenu"
import Header from "./Header"
import HomePage from "../home"
import ProductPage from "../product"
import LoginPage from "../login"

const Layout = () => {
  const { navMenuIsOpen, setUserIsLogged, setUserData } = useContext(
    GlobalStateContext,
  )

  const refreshTokenMutation = useMutation({
    mutationFn: async (refreshToken: string) => {
      const response = await api.post("/token/refresh/", {
        refresh: refreshToken,
      })

      return response.data
    },
    onSuccess: (data) => {
      Cookies.remove("access_token")
      Cookies.set("access_token", data.access)
      tokenValidationQuery.refetch()
    },
    onError: () => {
      Cookies.remove("access_token")
      Cookies.remove("refresh_token")
    },
  })

  const tokenValidationQuery = useQuery({
    queryKey: ["tokenValidation"],
    queryFn: async () => {
      const token = Cookies.get("access_token")

      if (!token) {
        return Promise.reject(new Error("Token not found"))
      }

      const response = await api.get("/users/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      return response.data
    },
    onSuccess: (data) => {
      setUserData(data)
      setUserIsLogged(true)
    },
    onError: () => {
      const refreshToken = Cookies.get("refresh_token")
      if (refreshToken) {
        refreshTokenMutation.mutate(refreshToken)
        return
      }

      setUserIsLogged(false)
    },
  })

  return (
    <>
      {navMenuIsOpen ? (
        <ProductsProvider>
          <NavMenu />
        </ProductsProvider>
      ) : null}

      <Header />

      <Routes>
        <Route
          path="/*"
          element={
            <ProductsProvider>
              <HomePage />
            </ProductsProvider>
          }
        />
        <Route path="/produtos/*" element={<ProductPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </>
  )
}

export default Layout
