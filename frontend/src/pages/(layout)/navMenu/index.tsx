import { useContext } from "react"
import { Link } from "react-router-dom"
import { GlobalStateContext } from "../../../store/GlobalStateProvider"
import { ProductsContext } from "../../../store/ProductsProvider"
import Button from "../../../components/Button"
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
  const { categories } = useContext(ProductsContext)

  const handleCloseButtonClick = () => {
    setNavMenuIsOpen(!navMenuIsOpen)
  }

  const categoriesButtons = categories?.map((categorie) => (
    <Button
      buttonParams="w-full"
      isRadio={true}
      name={categorie}
      key={categorie}
      isLink={true}
    />
  ))

  return (
    <nav
      className="absolute right-0 top-0 z-50 flex h-screen w-screen
      items-center justify-center bg-black bg-opacity-40"
    >
      <div
        className="flex h-fit w-fit flex-col gap-2
        rounded-md border-2 border-primaryShade bg-primary p-4"
      >
        <section
          className="flex w-72 flex-row justify-between
         px-2 [&>div:last-child]:border-r-0
         [&>div:last-child]:pr-0 [&>div]:border-r-2
         [&>div]:border-secondaryShade [&>div]:border-opacity-70
         [&>div]:py-1 [&>div]:pr-7"
        >
          <div className="flex items-center justify-center">
            <Link to={"/"}>
              <img
                src={cartIcon}
                alt="ícone do carrinho de compras"
                className="h-10"
              />
            </Link>
          </div>
          <div className="flex flex-col items-center justify-center">
            <Link
              to={"/"}
              className="font-bauhausRegular hover:underline"
            >
              Cadastre-se
            </Link>
            <Link
              to={"/"}
              className="font-bauhausRegular hover:underline"
            >
              Iniciar-sessão
            </Link>
          </div>
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
        </section>
        <section
          className="flex flex-col gap-1 border-y-2
        border-secondaryShade border-opacity-70 py-2"
        >
          <Button
            buttonParams="w-full"
            isRadio={true}
            name={"Todas as peças"}
            key={"Todas as peças"}
            isLink={true}
            link="pecas"
          />
          {categoriesButtons}
        </section>
        <section className="flex flex-row gap-2">
          <img
            src={wppIcon}
            alt="Ícone do aplicativo whatsapp"
            className="h-8"
          />
          <a
            href="https://www.instagram.com/boutiquerimini/"
            target="_blank"
          >
            <img
              src={instagramIcon}
              alt="Ícone do aplicativo instagram"
              className="h-8"
            />
          </a>
          <a
            href="https://pt-br.facebook.com/boutiquerimini/"
            target="_blank"
          >
            <img
              src={facebookIcon}
              alt="Ícone do aplicativo facebook"
              className="h-8"
            />
          </a>
          <img
            src={phoneIcon}
            alt="Ícone de um telefone"
            className="h-8"
          />
        </section>
      </div>
    </nav>
  )
}

export default NavMenu
