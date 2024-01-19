import { useContext } from "react"
import { Routes, Route } from "react-router-dom"
import { useMutation, useQuery } from "react-query"

import { api } from "../../store/QueryClient"
import { GlobalStateContext } from "../../store/GlobalStateProvider"
import ProductsProvider from "../../store/ProductsProvider"

import { LoadingSpinner } from "../../components/LoadingSpinner"
import NavMenu from "./NavMenu"
import Header from "./Header"
import HomePage from "../home"
import ProductPage from "../product"
import LoginPage from "../login"
import CartPage from "../cart"
import ProfilePage from "../profile"

const Layout = () => {
  const {
    navMenuIsOpen,
    setUserIsLogged,
    setUserData,
    setUserDetails,
  } = useContext(GlobalStateContext)

  const userDetailsQuery = useQuery({
    queryKey: ["userDetails"],
    queryFn: async () => {
      const response = await api.get("users_details")
      return response.data
    },
    onSuccess: (data) => {
      setUserDetails(data)
    },
    onError: () => {
      setUserIsLogged(false)
    },
    refetchOnWindowFocus: false,
    enabled: false,
  })

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await api.post("logout/")
      return response.data
    },
  })

  const refreshTokenMutation = useMutation({
    mutationFn: async () => {
      const response = await api.post("/token/refresh/")
      return response.data
    },
    onSuccess: () => {
      tokenValidationQuery.refetch()
    },
    onError: () => {
      logoutMutation.mutate()
    },
  })

  const tokenValidationQuery = useQuery({
    queryKey: ["tokenValidation"],
    queryFn: async () => {
      const response = await api.get("/users/")
      return response.data
    },
    onSuccess: (data) => {
      setUserData(data)
      setUserIsLogged(true)
      userDetailsQuery.refetch()
    },
    onError: () => {
      refreshTokenMutation.mutate()
    },
    refetchOnWindowFocus: false,
    retry: 1,
  })

  return tokenValidationQuery.isFetching ? (
    <div className="flex h-screen items-center justify-center">
      <LoadingSpinner />
    </div>
  ) : (
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
        <Route path="/carrinho" element={<CartPage />} />
        <Route path="/perfil" element={<ProfilePage />} />
      </Routes>
    </>
  )
}

export default Layout
