import { useContext } from "react"
import { Routes, Route } from "react-router-dom"
import ProductsProvider from "../../store/ProductsProvider"
import { GlobalStateContext } from "../../store/GlobalStateProvider"
import NavMenu from "./navMenu"
import Header from "./header"
import HomePage from "../home"
import ProductPage from "../product"

const Layout = () => {
  const { navMenuIsOpen } = useContext(GlobalStateContext)
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
      </Routes>
    </>
  )
}

export default Layout
