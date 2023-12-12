import { useContext } from "react"
import { Link } from "react-router-dom"
import { GlobalStateContext } from "../../../store/GlobalStateProvider"
import Categories from "../../../components/Categories"
import cartIcon from "/src/assets/cartIcon.svg"
import xIcon from "/src/assets/xIcon.svg"
import wppIcon from "/src/assets/whatsappIcon.svg"
import instagramIcon from "/src/assets/instagramIcon.svg"
import facebookIcon from "/src/assets/facebookIcon.svg"
import phoneIcon from "/src/assets/phoneIcon.svg"

const NavMenu = () => {
  const { navMenuIsOpen, setNavMenuIsOpen } = useContext(
    GlobalStateContext,
  )

  const handleCloseButtonClick = () => {
    setNavMenuIsOpen(!navMenuIsOpen)
  }

  const renderCartIcon = () => (
    <div className="flex items-center justify-center">
      <Link to={"/"}>
        <img
          src={cartIcon}
          alt="ícone do carrinho de compras"
          className="h-10"
        />
      </Link>
    </div>
  )

  const renderAuthLinks = () => (
    <div className="flex flex-col items-center justify-center">
      <Link to={"/"} className="font-bauhausRegular hover:underline">
        Cadastre-se
      </Link>
      <Link to={"/"} className="font-bauhausRegular hover:underline">
        Iniciar-sessão
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

  const renderSocialIcons = () => (
    <section className="flex flex-row gap-2">
      {renderSocialIcon(wppIcon, "Ícone do aplicativo whatsapp")}
      {renderSocialIcon(
        instagramIcon,
        "Ícone do aplicativo instagram",
        "https://www.instagram.com/boutiquerimini/",
      )}
      {renderSocialIcon(
        facebookIcon,
        "Ícone do aplicativo facebook",
        "https://pt-br.facebook.com/boutiquerimini/",
      )}
      {renderSocialIcon(phoneIcon, "Ícone de um telefone")}
    </section>
  )

  const renderSocialIcon = (
    src: string,
    alt: string,
    link?: string,
  ): JSX.Element => (
    <a href={link} target="_blank" rel="noopener noreferrer">
      <img src={src} alt={alt} className="h-8" />
    </a>
  )

  return (
    <nav className="absolute right-0 top-0 z-50 flex h-screen w-screen items-center justify-center bg-black bg-opacity-40">
      <div className="flex h-fit w-fit flex-col gap-2 rounded-md border-2 border-primaryShade bg-primary p-4">
        <section className="flex w-72 flex-row justify-between px-2 [&>div:last-child]:border-r-0 [&>div:last-child]:pr-0 [&>div]:border-r-2 [&>div]:border-secondaryShade [&>div]:border-opacity-70 [&>div]:py-1 [&>div]:pr-7">
          {renderCartIcon()}
          {renderAuthLinks()}
          {renderCloseButton()}
        </section>
        <section className="flex flex-col gap-1 border-y-2 border-secondaryShade border-opacity-70 py-2">
          <Categories />
        </section>
        {renderSocialIcons()}
      </div>
    </nav>
  )
}

export default NavMenu
