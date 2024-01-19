import { useContext } from "react"
import { useLocation } from "react-router-dom"

import { ProductsContext } from "../../store/ProductsProvider"
import { renderContactIcons } from "../../store/functions"
import { LoadingSpinner } from "../../components/LoadingSpinner"
import Categories from "../../components/Categories"
import Product from "../../components/Product"
import NavPages from "./NavPages"

type Product = {
  category: string
  picturesLinks: string[]
  name: string
  slug: string
  description: string
  sizesAvailable: string
  price: number
}

const HomePage = () => {
  const { products, isFetching } = useContext(ProductsContext)

  const location = useLocation()
  const pathParts = location.pathname.split("/")
  const firstEndPoint = pathParts[1]
  const capitalizeEndPoint =
    firstEndPoint !== "pecas"
      ? firstEndPoint.charAt(0).toUpperCase() + firstEndPoint.slice(1)
      : "Todas as peças"
  const categoryName = capitalizeEndPoint

  const isStrangeName =
    categoryName == "Cal%C3%A7as" || categoryName == "Acess%C3%B3rios"
  const categoryDebugName = isStrangeName
    ? categoryName == "Cal%C3%A7as"
      ? "Calças"
      : "Acessórios"
    : null

  const renderProducts = () => {
    return products?.map((product) => (
      <Product
        key={product.slug}
        imgURLs={product.picturesLinks[0]}
        title={product.name}
        slug={product.slug}
        price={product.price}
      />
    ))
  }

  return isFetching ? (
    <div className="flex h-full items-center justify-center">
      <LoadingSpinner />
    </div>
  ) : (
    <div className="flex h-fit flex-row justify-center gap-5 px-5 pt-7">
      <section
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
          <Categories />
        </div>
      </section>

      <section className="flex w-fit flex-col">
        <header className="flex w-full flex-row items-center justify-between py-2">
          <div className="flex flex-row items-end justify-center gap-2">
            <div className="h-4 w-4 rounded-full bg-secondaryShade sm:h-6 sm:w-6"></div>
            <h2 className="text-base leading-3 sm:text-xl sm:leading-6">
              {isStrangeName ? categoryDebugName : categoryName}
            </h2>
          </div>
          <NavPages />
        </header>

        <main
          className="grid grid-cols-2 gap-x-7 border-y-2 border-secondaryShade
          border-opacity-80 sm:gap-x-7 md:grid-cols-3 2xl:grid-cols-4"
        >
          {renderProducts()}
        </main>

        <footer className="mb-28 flex flex-row justify-between py-2">
          <div className="flex flex-row gap-2">
            <p className="hidden text-center font-bauhausRegular sm:block">
              Contatos
            </p>
            {renderContactIcons()}
          </div>
          <NavPages />
        </footer>
      </section>
    </div>
  )
}

export default HomePage
