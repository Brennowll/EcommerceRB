import { useContext } from "react"
import { ProductsContext } from "../../store/ProductsProvider"
import CategoryLink from "../CategoryLink"

const Categories = () => {
  const { categories } = useContext(ProductsContext)
  const categoriesLinks = categories?.map((categorie) => (
    <CategoryLink name={categorie} key={categorie} />
  ))

  return (
    <>
      <CategoryLink
        name={"Todas as peças"}
        link="pecas"
        key={"Todas as peças"}
      />
      {categoriesLinks}
    </>
  )
}

export default Categories
