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

  const handleResize = () => {
    setWindowWidth(window.innerWidth)
  }

  useEffect(() => {
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  const renderContactIcons = () => (
    <div className="hidden items-center justify-center gap-2 lg:grid">
      <p className="text-center font-bauhausRegular">Contatos</p>
      <div className="flex w-32 flex-row justify-center gap-2">
        {renderIcon(
          wppIcon,
          "Ícone do aplicativo whatsapp",
          "h-6 transition-all hover:h-7",
        )}
        {renderIcon(
          instagramIcon,
          "Ícone do aplicativo instagram",
          "h-6 transition-all hover:h-7",
          true,
          "https://www.instagram.com/boutiquerimini/",
        )}
        {renderIcon(
          facebookIcon,
          "Ícone do aplicativo facebook",
          "h-6 transition-all hover:h-7",
          true,
          "https://pt-br.facebook.com/boutiquerimini/",
        )}
        {renderIcon(
          phoneIcon,
          "Ícone de um telefone",
          "h-6 transition-all hover:h-7",
        )}
      </div>
    </div>
  )

  const renderAuthLinks = () => (
    <div
      className="hidden items-center justify-center md:flex md:flex-col
      [&>a]:font-bauhausRegular"
    >
      {renderNavLink("/login", "Cadastre-se", "hover:underline")}
      {renderNavLink("/login", "Iniciar-sessão", "hover:underline")}
    </div>
  )

  const renderCartIcon = () => (
    <div className="hidden items-center justify-center md:flex">
      <a href="/carrinho">
        {renderIcon(
          cartIcon,
          "ícone do carrinho de compras",
          "h-12 transition-all hover:h-14",
        )}
      </a>
    </div>
  )

  const renderMenuIcon = () =>
    windowWidth < 1024 && (
      <button
        className="flex items-center justify-center px-6"
        onClick={handleMenuButtonClick}
      >
        {renderIcon(menuIcon, "ícone do menú", "h-10 sm:h-12")}
      </button>
    )

  const renderIcon = (
    src: string,
    alt: string,
    className?: string,
    isLink?: boolean,
    link?: string,
  ): JSX.Element =>
    !isLink && !link ? (
      <img src={src} alt={alt} className={className} />
    ) : (
      <a href={link} target="_blank">
        <img src={src} alt={alt} className={className} />
      </a>
    )

  const renderNavLink = (
    href: string,
    text: string,
    className?: string,
  ): JSX.Element => (
    <a href={href} className={className}>
      {text}
    </a>
  )

  return (
    <header
      className="flex max-h-36 items-center justify-center border-b-2
      border-secondaryShade border-opacity-80 bg-primary px-2 py-4 sm:px-0"
    >
      <div
        className="flex w-full max-w-[21rem] items-center justify-between
        py-4 sm:max-w-lg md:max-w-3xl lg:max-w-[63rem] xl:max-w-[67rem]
        2xl:max-w-[83rem]"
      >
        <a href="/pecas">
          {renderIcon(
            "/src/assets/RiminiLogoW.png",
            "Logo da Rimini Boutique",
            "w-60 object-cover sm:h-20 md:ml-2 md:h-28 md:w-80 xl:ml-0",
          )}
        </a>
        <nav
          className="flex h-full flex-row items-center
          [&>div:last-child]:border-r-0 [&>div]:h-full [&>div]:max-h-20
          [&>div]:border-r-2 [&>div]:border-secondaryShade [&>div]:px-6
          [&>div]:py-4"
        >
          {renderContactIcons()}
          {renderAuthLinks()}
          {renderCartIcon()}
          {renderMenuIcon()}
        </nav>
      </div>
    </header>
  )
}

export default Header
