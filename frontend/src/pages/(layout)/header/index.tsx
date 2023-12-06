import { useState, useEffect, useContext } from "react"
import { GlobalStateContext } from "../../../store/GlobalStateProvider"
import wppIcon from "/src/assets/whatsappIcon.svg"
import instagramIcon from "/src/assets/instagramIcon.svg"
import facebookIcon from "/src/assets/facebookIcon.svg"
import phoneIcon from "/src/assets/phoneIcon.svg"
import cartIcon from "/src/assets/cartIcon.svg"
import menuIcon from "/src/assets/menuIcon.svg"

const Header = () => {
  const { navMenuIsOpen, setNavMenuIsOpen } = useContext(
    GlobalStateContext,
  )
  const [windowWidth, setWindowWidth] = useState<number>(
    window.innerWidth,
  )

  const handleMenuButtonClick = () => {
    setNavMenuIsOpen(!navMenuIsOpen)
  }

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return (
    <header
      className="flex max-h-36 items-center
      justify-center border-b-2 border-secondaryShade
      border-opacity-80 bg-primary px-2 py-4 sm:px-0"
    >
      <div
        className="flex w-full max-w-[21rem] items-center justify-between
        py-4 sm:max-w-lg md:max-w-3xl lg:max-w-[63rem]
        xl:max-w-[67rem] 2xl:max-w-[83rem]"
      >
        <a href="/pecas">
          <img
            src="/src/assets/RiminiLogoW.png"
            alt="Logo da Rimini Boutique"
            className="w-60 object-cover sm:h-20 md:ml-2 md:h-28
            md:w-80 xl:ml-0"
          />
        </a>
        <nav
          className="flex h-full flex-row items-center [&>div:last-child]:border-r-0 
          [&>div]:h-full [&>div]:max-h-20 [&>div]:border-r-2
          [&>div]:border-secondaryShade [&>div]:px-6 [&>div]:py-4"
        >
          <div
            className="hidden items-center justify-center
            gap-2 lg:grid"
          >
            <p className="text-center font-bauhausRegular">
              Contatos
            </p>
            <div className="flex w-32 flex-row justify-center gap-2">
              <img
                src={wppIcon}
                alt="Ícone do aplicativo whatsapp"
                className="h-6 transition-all hover:h-7"
              />
              <a
                href="https://www.instagram.com/boutiquerimini/"
                target="_blank"
              >
                <img
                  src={instagramIcon}
                  alt="Ícone do aplicativo instagram"
                  className="h-6 transition-all hover:h-7"
                />
              </a>
              <a
                href="https://pt-br.facebook.com/boutiquerimini/"
                target="_blank"
              >
                <img
                  src={facebookIcon}
                  alt="Ícone do aplicativo facebook"
                  className="h-6 transition-all hover:h-7"
                />
              </a>
              <img
                src={phoneIcon}
                alt="Ícone de um telefone"
                className="h-6 transition-all hover:h-7"
              />
            </div>
          </div>
          <div
            className="hidden items-center justify-center md:flex
          md:flex-col [&>a]:font-bauhausRegular"
          >
            <a href="/cadastro" className="hover:underline">
              Cadastre-se
            </a>
            <a href="/login" className="hover:underline">
              Iniciar-sessão
            </a>
          </div>
          <div className="hidden items-center justify-center md:flex">
            <a href="/carrinho">
              <img
                src={cartIcon}
                alt="ícone do carrinho de compras"
                className="h-12 transition-all hover:h-14"
              />
            </a>
          </div>
          {windowWidth < 1024 ? (
            <button
              className="flex items-center justify-center px-6"
              onClick={handleMenuButtonClick}
            >
              <img
                src={menuIcon}
                alt="ícone do menú"
                className="h-10 sm:h-12"
              />
            </button>
          ) : null}
        </nav>
      </div>
    </header>
  )
}

export default Header
