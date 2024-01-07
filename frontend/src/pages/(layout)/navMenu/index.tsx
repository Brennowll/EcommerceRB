import { useContext } from "react"
import { Link } from "react-router-dom"

import { GlobalStateContext } from "../../../store/GlobalStateProvider"
import { renderContactIcons } from "../../../store/functions"
import AuthLinks from "../../../components/AuthLinks"
import Categories from "../../../components/Categories"
import cartIcon from "/src/assets/cartIcon.svg"
import xIcon from "/src/assets/xIcon.svg"

const NavMenu = () => {
  const { navMenuIsOpen, setNavMenuIsOpen } = useContext(
    GlobalStateContext,
  )

  const handleCloseButtonClick = () => {
    setNavMenuIsOpen(!navMenuIsOpen)
  }

  const renderCartIcon = () => (
    <div className="flex items-center justify-center">
      <Link to={"/carrinho"}>
        <img
          src={cartIcon}
          alt="ícone do carrinho de compras"
          className="h-10"
        />
      </Link>
    </div>
  )

  const renderCloseButton = () => (
    <button
      className="flex items-center justify-center"
      onClick={handleCloseButtonClick}
    >
      <img
        src={xIcon}
        alt="Icone de X para fechar o menu de navegação"
        className="h-8"
      />
    </button>
  )

  return (
    <section
      className="absolute right-0 top-0 z-50 flex h-screen w-screen items-center
      justify-center bg-black bg-opacity-40"
    >
      <div
        className="flex h-fit w-fit flex-col gap-2 rounded-md border-2
        border-primaryShade bg-primary p-4"
      >
        <nav
          className="flex w-72 flex-row justify-around px-2
          [&>div:last-child]:border-r-0 [&>div:last-child]:pr-0 [&>div]:border-r-2
          [&>div]:border-secondaryShade [&>div]:border-opacity-70 [&>div]:py-1 [&>div]:pr-7"
        >
          {renderCartIcon()}
          <AuthLinks containerClass="flex flex-col" />
          {renderCloseButton()}
        </nav>

        <nav
          className="flex flex-col gap-1 border-y-2 border-secondaryShade
          border-opacity-70 py-2"
        >
          <Categories />
        </nav>

        {renderContactIcons()}
      </div>
    </section>
  )
}

export default NavMenu
