import { useContext } from "react"
import { useLocation } from "react-router-dom"
import { ProductsContext } from "../../store/ProductsProvider"
import Button from "../../components/Button"
import Product from "../../components/Product"
import NavPages from "./NavPages"
import wppIcon from "/src/assets/whatsappIcon.svg"
import instagramIcon from "/src/assets/instagramIcon.svg"
import facebookIcon from "/src/assets/facebookIcon.svg"
import phoneIcon from "/src/assets/phoneIcon.svg"

const HomePage = () => {
  const { categories, products } = useContext(ProductsContext)

  const categoriesButtons = categories?.map((categorie) => (
    <Button
      buttonParams="w-full"
      isRadio={true}
      name={categorie}
      isCategoryButton={true}
      isLink={true}
      key={categorie}
    />
  ))

  const location = useLocation()
  const pathParts = location.pathname.split("/")
  const firstEndPoint = pathParts[1]
  const capitalizeEndPoint =
    firstEndPoint != "pecas"
      ? firstEndPoint.charAt(0).toUpperCase() + firstEndPoint.slice(1)
      : "Todas as peças"
  const categoryName = capitalizeEndPoint

  return (
    <div
      className="flex h-fit flex-row
      justify-center gap-5 px-5 pt-7"
    >
      <div
        id="categoriesTab"
        className="sticky top-5 hidden h-fit w-60 flex-col rounded-md
        border-2 border-primaryShade bg-primary p-4 lg:flex xl:w-80"
      >
        <div
          className="flex flex-row items-center
          gap-4 border-b-2 border-secondaryShade py-2 pl-2"
        >
          <div className="h-6 w-6 rounded-full bg-secondaryShade"></div>
          <h3 className="text-xl">Categorias</h3>
        </div>
        <div className="flex flex-col gap-1 pt-2">
          <Button
            buttonParams="w-full"
            isRadio={true}
            name={"Todas as peças"}
            isCategoryButton={true}
            isLink={true}
            link="pecas"
            key={"Todas as peças"}
          />
          {categoriesButtons}
        </div>
      </div>
      <div className="flex w-fit flex-col">
        <div
          className="flex w-full flex-row items-center
          justify-between py-2"
        >
          <div className="flex flex-row items-end justify-center gap-2">
            <div className="h-4 w-4 rounded-full bg-secondaryShade sm:h-6 sm:w-6"></div>
            <h2 className="text-base leading-3 sm:text-xl sm:leading-6">
              {categoryName}
            </h2>
          </div>
          <NavPages />
        </div>
        <div
          className="grid grid-cols-2 gap-x-7
          border-y-2 border-secondaryShade border-opacity-80
          sm:gap-x-7 md:grid-cols-3 2xl:grid-cols-4"
        >
          {firstEndPoint != "pecas"
            ? products?.map((product) =>
                product.category.toLowerCase() == firstEndPoint ? (
                  <Product
                    key={product.id}
                    id={product.id}
                    imgURLs={product.picturesLinks[0]}
                    title={product.name}
                    price={product.price}
                  />
                ) : null,
              )
            : products?.map((product) => (
                <Product
                  key={product.id}
                  id={product.id}
                  imgURLs={product.picturesLinks[0]}
                  title={product.name}
                  price={product.price}
                />
              ))}
        </div>
        <div className="mb-28 flex flex-row justify-between py-2">
          <div className="flex flex-row gap-2">
            <p className="hidden text-center font-bauhausRegular sm:block">
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
          <NavPages />
        </div>
      </div>
    </div>
  )
}

export default HomePage
